import { expect, use } from 'chai'
import { RenderError } from '../../../src/util/error'
import { Liquid } from '../../../src/liquid'
import * as path from 'path'
import { mock, restore } from '../../stub/mockfs'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

let engine = new Liquid()
const strictEngine = new Liquid({
  strictVariables: true,
  strictFilters: true
})

describe('error', function () {
  afterEach(restore)

  describe('TokenizationError', function () {
    it('should throw TokenizationError when tag illegal', async function () {
      const err = await expect(engine.parseAndRender('{% . a %}', {})).be.rejected
      expect(err.name).to.equal('TokenizationError')
      expect(err.message).to.contain('illegal tag syntax')
    })
    it('should contain template content in err.message', async function () {
      const html = ['1st', '2nd', 'X{% . a %} Y', '4th']
      const message = [
        '   1| 1st',
        '   2| 2nd',
        '>> 3| X{% . a %} Y',
        '   4| 4th',
        'TokenizationError'
      ]
      const err = await expect(engine.parseAndRender(html.join('\n'))).be.rejected
      expect(err.message).to.equal('illegal tag syntax, line:3, col:2')
      expect(err.stack).to.contain(message.join('\n'))
      expect(err.name).to.equal('TokenizationError')
    })
    it('should contain the whole template content in err.token.input', async function () {
      const html = 'bar\nfoo{% . a %}\nfoo'
      const err = await expect(engine.parseAndRender(html)).be.rejected
      expect(err.token.input).to.equal(html)
    })
    it('should contain stack in err.stack', async function () {
      const err = await expect(engine.parseAndRender('{% . a %}')).be.rejected
      expect(err.message).to.contain('illegal tag syntax')
      expect(err.stack).to.contain('at Liquid.parse')
    })
    describe('captureStackTrace compatibility', function () {
      it('should be empty when captureStackTrace undefined', async function () {
        const err = await expect(engine.parseAndRender('{% . a %}')).be.rejected
        expect(err.stack).to.contain('illegal tag syntax')
        expect(err.stack).to.not.contain('at Object.parse')
      })
    })
    it('should throw error with [line, col] if tag unmatched', async function () {
      const err = await expect(engine.parseAndRender('1\n2\nfoo{% assign a = 4 }\n4')).be.rejected
      console.log(err.stack)
      expect(err.name).to.equal('TokenizationError')
      expect(err.message).to.equal('tag "{% assign a =..." not closed, line:3, col:4')
    })
  })

  describe('RenderError', function () {
    beforeEach(function () {
      engine = new Liquid({
        root: '/'
      })
      engine.registerTag('throwingTag', {
        render: function () {
          throw new Error('intended render error')
        }
      })
      engine.registerTag('rejectingTag', {
        render: async function () {
          throw new Error('intended render reject')
        }
      })
      engine.registerFilter('throwingFilter', () => {
        throw new Error('throwed by filter')
      })
    })
    it('should throw RenderError when tag throws', async function () {
      const src = '{%throwingTag%}'
      const err = await expect(engine.parseAndRender(src)).be.rejected
      expect(err.name).to.equal('RenderError')
      expect(err.message).to.contain('intended render error')
    })
    it('should throw RenderError when tag rejects', async function () {
      const src = '{%rejectingTag%}'
      const err = await expect(engine.parseAndRender(src)).be.rejected
      expect(err.name).to.equal('RenderError')
      expect(err.message).to.contain('intended render reject')
    })
    it('should throw RenderError when filter throws', async function () {
      const src = '{{1|throwingFilter}}'
      const err = await expect(engine.parseAndRender(src)).be.rejected
      expect(err.name).to.equal('RenderError')
      expect(err.message).to.contain('throwed by filter')
    })
    it('should not throw when variable undefined by default', async function () {
      const html = await engine.parseAndRender('X{{a}}Y')
      return expect(html).to.equal('XY')
    })
    it('should throw RenderError when variable not defined', async function () {
      const err = await expect(strictEngine.parseAndRender('{{a}}')).be.rejected
      expect(err).to.have.property('name', 'RenderError')
      expect(err.message).to.contain('undefined variable: a')
    })
    it('should contain template context in err.stack', async function () {
      const html = ['1st', '2nd', '3rd', 'X{%throwingTag%} Y', '5th', '6th', '7th']
      const message = [
        '   2| 2nd',
        '   3| 3rd',
        '>> 4| X{%throwingTag%} Y',
        '   5| 5th',
        '   6| 6th',
        '   7| 7th',
        'RenderError'
      ]
      const err = await expect(engine.parseAndRender(html.join('\n'))).be.rejected
      expect(err.message).to.equal('intended render error, line:4, col:2')
      expect(err.stack).to.contain(message.join('\n'))
      expect(err.name).to.equal('RenderError')
    })
    it('should contain original error info for {% layout %}', async function () {
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
      const html = '{%layout "throwing-tag.html"%}'
      const message = [
        '   2| 2nd',
        '   3| 3rd',
        '>> 4| X{%throwingTag%} Y',
        '   5| 5th',
        '   6| {%block%}{%endblock%}',
        '   7| 7th',
        'RenderError'
      ]
      const err = await expect(engine.parseAndRender(html)).be.rejected
      expect(err.message).to.equal(`intended render error, file:${path.resolve('/throwing-tag.html')}, line:4, col:2`)
      expect(err.stack).to.contain(message.join('\n'))
      expect(err.name).to.equal('RenderError')
    })
    it('should contain original error info for {% include %}', async function () {
      const origin = ['1st', '2nd', '3rd', 'X{%throwingTag%} Y', '5th', '6th', '7th']
      mock({
        '/throwing-tag.html': origin.join('\n')
      })
      const html = '{%include "throwing-tag.html"%}'
      const message = [
        '   2| 2nd',
        '   3| 3rd',
        '>> 4| X{%throwingTag%} Y',
        '   5| 5th',
        '   6| 6th',
        '   7| 7th',
        'RenderError'
      ]
      const err = await expect(engine.parseAndRender(html)).be.rejected
      expect(err.message).to.equal(`intended render error, file:${path.resolve('/throwing-tag.html')}, line:4, col:2`)
      expect(err.stack).to.contain(message.join('\n'))
      expect(err.name).to.equal('RenderError')
    })
    it('should contain stack in err.stack', async function () {
      const err = await expect(engine.parseAndRender('{%rejectingTag%}')).be.rejected
      expect(err.message).to.contain('intended render reject')
      expect(err.stack).to.match(/at .*:\d+:\d+/)
    })
  })

  describe('ParseError', function () {
    beforeEach(function () {
      engine = new Liquid()
      engine.registerTag('throwsOnParse', {
        parse: function () {
          throw new Error('intended parse error')
        },
        render: () => ''
      })
    })
    it('should throw ParseError when filter not defined', async function () {
      const err = await expect(strictEngine.parseAndRender('{{1 | a}}')).be.rejected
      expect(err).to.have.property('name', 'ParseError')
      expect(err.message).to.contain('undefined filter: a')
    })
    it('should throw ParseError when tag not closed', async function () {
      const err = await expect(engine.parseAndRender('{% if %}')).be.rejected
      expect(err.name).to.equal('ParseError')
      expect(err.message).to.contain('tag {% if %} not closed')
    })
    it('should throw ParseError when tag parse throws', async function () {
      const err = await expect(engine.parseAndRender('{%throwsOnParse%}')).be.rejected
      expect(err.name).to.equal('ParseError')
      expect(err.message).to.contain('intended parse error')
    })
    it('should throw ParseError when tag not found', async function () {
      const src = '{%if true%}\naaa{%endif%}\n{% -a %}\n3'
      const err = await expect(engine.parseAndRender(src)).be.rejected
      expect(err.name).to.equal('ParseError')
      expect(err.message).to.contain('tag "-a" not found')
    })
    it('should throw ParseError when tag not exist', async function () {
      const err = await expect(engine.parseAndRender('{% a %}')).be.rejected
      expect(err.name).to.equal('ParseError')
      expect(err.message).to.contain('tag "a" not found')
    })

    it('should contain template context in err.stack', async function () {
      const html = ['1st', '2nd', '3rd', 'X{% a %} {% enda %} Y', '5th', '6th', '7th']
      const message = [
        '   2| 2nd',
        '   3| 3rd',
        '>> 4| X{% a %} {% enda %} Y',
        '   5| 5th',
        '   6| 6th',
        '   7| 7th',
        'ParseError: tag "a" not found'
      ]
      const err = await expect(engine.parseAndRender(html.join('\n'))).be.rejected
      expect(err.message).to.equal('tag "a" not found, line:4, col:2')
      expect(err.stack).to.contain(message.join('\n'))
      expect(err.name).to.equal('ParseError')
    })

    it('should handle err.message when context not enough', async function () {
      const html = ['1st', 'X{% a %} {% enda %} Y', '3rd', '4th']
      const message = [
        '   1| 1st',
        '>> 2| X{% a %} {% enda %} Y',
        '   3| 3rd',
        '   4| 4th',
        'ParseError: tag "a" not found'
      ]
      const err = await expect(engine.parseAndRender(html.join('\n'))).be.rejected
      expect(err.message).to.equal('tag "a" not found, line:2, col:2')
      expect(err.stack).to.contain(message.join('\n'))
    })

    it('should contain stack in err.stack', async function () {
      const err = await expect(engine.parseAndRender('{% -a %}')).be.rejected
      expect(err.stack).to.contain('ParseError: tag "-a" not found')
      expect(err.stack).to.match(/at .*:\d+:\d+\)/)
    })
  })
  describe('sync support', function () {
    let engine: Liquid
    beforeEach(function () {
      engine = new Liquid({
        root: '/'
      })
      engine.registerTag('throwingTag', {
        render: function () {
          throw new Error('intended render error')
        }
      })
    })
    it('should throw RenderError when tag throws', function () {
      const src = '{%throwingTag%}'
      expect(() => engine.parseAndRenderSync(src))
        .to.throw(RenderError, /intended render error/)
    })
    it('should contain original error info for {% include %}', function () {
      mock({
        '/throwing-tag.html': ['1st', '2nd', '3rd', 'X{%throwingTag%} Y', '5th', '6th', '7th'].join('\n')
      })
      const html = '{%include "throwing-tag.html"%}'
      const message = [
        '   2| 2nd',
        '   3| 3rd',
        '>> 4| X{%throwingTag%} Y',
        '   5| 5th',
        '   6| 6th',
        '   7| 7th',
        'RenderError'
      ]
      try {
        engine.parseAndRenderSync(html)
        throw new Error('expected throw')
      } catch (err) {
        expect(err.message).to.equal(`intended render error, file:${path.resolve('/throwing-tag.html')}, line:4, col:2`)
        expect(err.stack).to.contain(message.join('\n'))
        expect(err.name).to.equal('RenderError')
      }
    })
  })
})
