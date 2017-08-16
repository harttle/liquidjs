const chai = require('chai')
const expect = chai.expect
const mock = require('mock-fs')
chai.use(require('chai-as-promised'))

var engine = require('../..')()
var strictEngine = require('../..')({
  strict_variables: true,
  strict_filters: true
})

describe('error', function () {
  afterEach(function () {
    mock.restore()
  })

  describe('TokenizationError', function () {
    it('should throw TokenizationError when tag illegal', function () {
      return expect(engine.parseAndRender('{% . a %}', {})).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.name).to.equal('TokenizationError')
          expect(err.message).to.contain('illegal tag syntax')
        })
    })
    it('should contain template content in err.message', function () {
      var html = ['1st', '2nd', 'X{% . a %} Y', '4th']
      var message = [
        '   1| 1st',
        '   2| 2nd',
        '>> 3| X{% . a %} Y',
        '   4| 4th',
        'TokenizationError: illegal tag syntax'
      ]
      return expect(engine.parseAndRender(html.join('\n'))).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.message).to.equal('illegal tag syntax, line:3')
          expect(err.stack).to.contain(message.join('\n'))
          expect(err.name).to.equal('TokenizationError')
        })
    })
    it('should contain the whole template content in err.input', function () {
      var html = 'bar\nfoo{% . a %}\nfoo'
      return expect(engine.parseAndRender(html)).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.input).to.equal(html)
        })
    })
    it('should contain line number in err.line', function () {
      return expect(engine.parseAndRender('1\n2\n{% . a %}\n4', {})).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.name).to.equal('TokenizationError')
          expect(err.line).to.equal(3)
        })
    })
    it('should contain stack in err.stack', function () {
      return expect(engine.parseAndRender('{% . a %}')).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.stack).to.contain('illegal tag syntax')
          expect(err.stack).to.contain('at Object.parse')
        })
    })
    it('should contain file path in err.file', function () {
      var html = '<html>\n<head>\n\n{% . a %}\n\n'
      mock({
        '/foo.html': html
      })
      return expect(engine.renderFile('/foo.html')).to.eventually
        .be.rejected
        .then(function (err) {
          mock.restore()
          expect(err.name).to.equal('TokenizationError')
          expect(err.file).to.equal('/foo.html')
        })
    })
  })

  describe('RenderError', function () {
    beforeEach(function () {
      engine = require('../..')({
        root: '/'
      })
      engine.registerTag('throwingTag', {
        render: function () {
          throw new Error('intended render error')
        }
      })
      engine.registerTag('rejectingTag', {
        render: function () {
          return Promise.reject(new Error('intended render reject'))
        }
      })
      engine.registerFilter('throwingFilter', () => {
        throw new Error('throwed by filter')
      })
    })
    it('should throw RenderError when tag throws', function () {
      var src = '{%throwingTag%}'
      return expect(engine.parseAndRender(src)).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.name).to.equal('RenderError')
          expect(err.message).to.contain('intended render error')
        })
    })
    it('should throw RenderError when tag rejects', function () {
      var src = '{%rejectingTag%}'
      return expect(engine.parseAndRender(src)).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.name).to.equal('RenderError')
          expect(err.message).to.contain('intended render reject')
        })
    })
    it('should throw RenderError when filter throws', function () {
      var src = '{{1|throwingFilter}}'
      return expect(engine.parseAndRender(src)).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.name).to.equal('RenderError')
          expect(err.message).to.contain('throwed by filter')
        })
    })
    it('should not throw when variable undefined by default', function () {
      return expect(engine.parseAndRender('X{{a}}Y')).to.eventually.equal('XY')
    })
    it('should throw RenderError when variable not defined', function () {
      return expect(strictEngine.parseAndRender('{{a}}')).to.eventually
        .be.rejected
        .then(function (e) {
          expect(e).to.have.property('name', 'RenderError')
          expect(e.message).to.contain('undefined variable: a')
        })
    })
    it('should contain template context in err.stack', function () {
      var html = ['1st', '2nd', '3rd', 'X{%throwingTag%} Y', '5th', '6th', '7th']
      var message = [
        '   2| 2nd',
        '   3| 3rd',
        '>> 4| X{%throwingTag%} Y',
        '   5| 5th',
        '   6| 6th',
        '   7| 7th',
        'Error: intended render error'
      ]
      return expect(engine.parseAndRender(html.join('\n'))).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.message).to.equal('intended render error, line:4')
          expect(err.stack).to.contain(message.join('\n'))
          expect(err.name).to.equal('RenderError')
        })
    })
    it('should contain original error info for {% extends %}', function () {
      mock({
        '/throwing-tag.html': [
          '1st',
          '2nd',
          '3rd',
          'X{%throwingTag%} Y',
          '5th',
          '{%block%}{%endblock%}',
          '7th'
        ].join('\n')
      })
      var html = '{%extends "throwing-tag.html"%}'
      var message = [
        '   2| 2nd',
        '   3| 3rd',
        '>> 4| X{%throwingTag%} Y',
        '   5| 5th',
        '   6| {%block%}{%endblock%}',
        '   7| 7th',
        'Error: intended render error'
      ]
      return expect(engine.parseAndRender(html)).to.eventually
        .be.rejected
        .then(function (err) {
          console.log(err.message)
          console.log(err.stack)
          expect(err.message).to.equal('intended render error, file:/throwing-tag.html, line:4')
          expect(err.stack).to.contain(message.join('\n'))
          expect(err.name).to.equal('RenderError')
        })
    })
    it('should contain original error info for {% include %}', function () {
      var origin = ['1st', '2nd', '3rd', 'X{%throwingTag%} Y', '5th', '6th', '7th']
      mock({
        '/throwing-tag.html': origin.join('\n')
      })
      var html = '{%include "throwing-tag.html"%}'
      var message = [
        '   2| 2nd',
        '   3| 3rd',
        '>> 4| X{%throwingTag%} Y',
        '   5| 5th',
        '   6| 6th',
        '   7| 7th',
        'Error: intended render error'
      ]
      return expect(engine.parseAndRender(html)).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.message).to.equal('intended render error, file:/throwing-tag.html, line:4')
          expect(err.stack).to.contain(message.join('\n'))
          expect(err.name).to.equal('RenderError')
        })
    })
    it('should contain the whole template content in err.input', function () {
      var html = 'bar\nfoo{%throwingTag%}\nfoo'
      return expect(engine.parseAndRender(html)).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.input).to.equal(html)
          expect(err.name).to.equal('RenderError')
        })
    })
    it('should contain line number in err.line', function () {
      var src = '1\n2\n{{1|throwingFilter}}\n4'
      return expect(engine.parseAndRender(src)).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.line).to.equal(3)
          expect(err.name).to.equal('RenderError')
        })
    })
    it('should contain stack in err.stack', function () {
      return expect(engine.parseAndRender('{%rejectingTag%}')).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.stack).to.contain('intended render reject')
          expect(err.stack).to.match(/at .*:\d+:\d+\)/)
        })
    })

    it('should contain file path in err.file', function () {
      var html = '<html>\n<head>\n\n{% throwingTag %}\n\n'
      mock({
        '/foo.html': html
      })
      return expect(engine.renderFile('/foo.html')).to.eventually
        .be.rejected
        .then(function (err) {
          mock.restore()
          expect(err.name).to.equal('RenderError')
          expect(err.file).to.equal('/foo.html')
        })
    })
  })

  describe('ParseError', function () {
    beforeEach(function () {
      engine = require('../..')()
      engine.registerTag('throwsOnParse', {
        parse: function () {
          throw new Error('intended parse error')
        }
      })
    })
    it('should throw RenderError when filter not defined', function () {
      return expect(strictEngine.parseAndRender('{{1 | a}}')).to.eventually
        .be.rejected
        .then(function (e) {
          expect(e).to.have.property('name', 'ParseError')
          expect(e.message).to.contain('undefined filter: a')
        })
    })
    it('should throw ParseError when tag not closed', function () {
      return expect(engine.parseAndRender('{% if %}')).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.name).to.equal('ParseError')
          expect(err.message).to.contain('tag {% if %} not closed')
        })
    })
    it('should throw ParseError when tag parse throws', function () {
      var src = '{%throwsOnParse%}'
      return expect(engine.parseAndRender(src)).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.name).to.equal('ParseError')
          expect(err.message).to.contain('intended parse error')
        })
    })
    it('should throw ParseError when tag not found', function () {
      var src = '{%if true%}\naaa{%endif%}\n{% -a %}\n3'
      return expect(engine.parseAndRender(src)).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.name).to.equal('ParseError')
          expect(err.message).to.contain('tag -a not found')
        })
    })

    it('should throw ParseError when tag not exist', function () {
      return expect(engine.parseAndRender('{% a %}')).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.name).to.equal('ParseError')
          expect(err.message).to.contain('tag a not found')
        })
    })

    it('should contain template context in err.stack', function () {
      var html = ['1st', '2nd', '3rd', 'X{% a %} {% enda %} Y', '5th', '6th', '7th']
      var message = [
        '   2| 2nd',
        '   3| 3rd',
        '>> 4| X{% a %} {% enda %} Y',
        '   5| 5th',
        '   6| 6th',
        '   7| 7th',
        'AssertionError: tag a not found'
      ]
      return expect(engine.parseAndRender(html.join('\n'))).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.message).to.equal('tag a not found, line:4')
          expect(err.stack).to.contain(message.join('\n'))
          expect(err.name).to.equal('ParseError')
        })
    })

    it('should handle err.message when context not enough', function () {
      var html = ['1st', 'X{% a %} {% enda %} Y', '3rd', '4th']
      var message = [
        '   1| 1st',
        '>> 2| X{% a %} {% enda %} Y',
        '   3| 3rd',
        '   4| 4th',
        'AssertionError: tag a not found'
      ]
      return expect(engine.parseAndRender(html.join('\n'))).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.message).to.equal('tag a not found, line:2')
          expect(err.stack).to.contain(message.join('\n'))
        })
    })

    it('should contain the whole template content in err.input', function () {
      var html = 'bar\nfoo{% a %}\nfoo'
      return expect(engine.parseAndRender(html)).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.input).to.equal(html)
        })
    })

    it('should contain line number in err.line', function () {
      var html = '<html>\n<head>\n\n{% raw %}\n\n'
      return expect(engine.parseAndRender(html)).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.line).to.equal(4)
        })
    })

    it('should contain stack in err.stack', function () {
      return expect(engine.parseAndRender('{% -a %}')).to.eventually
        .be.rejected
        .then(function (err) {
          expect(err.stack).to.contain('AssertionError: tag -a not found')
          expect(err.stack).to.match(/at .*:\d+:\d+\)/)
        })
    })

    it('should contain file path in err.file', function () {
      var html = '<html>\n<head>\n\n{% raw %}\n\n'
      mock({
        '/foo.html': html
      })
      return expect(engine.renderFile('/foo.html')).to.eventually
        .be.rejected
        .then(function (err) {
          mock.restore()
          expect(err.name).to.equal('ParseError')
          expect(err.file).to.equal('/foo.html')
        })
    })
  })
})
