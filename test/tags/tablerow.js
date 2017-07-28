const Liquid = require('../..')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/tablerow', function () {
  var liquid = Liquid()

  it('should support tablerow', function () {
    var src = '{% tablerow i in alpha cols:2 %}{{ i }}{% endtablerow %}'
    var ctx = {
      alpha: ['a', 'b', 'c']
    }
    var dst = '<table>' +
            '<tr class="row1"><td class="col1">a</td><td class="col2">b</td></tr>' +
            '<tr class="row2"><td class="col1">c</td></tr>' +
            '</table>'
    return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(dst)
  })

  it('should support empty tablerow', function () {
    var src = '{% tablerow i in (1..0) cols:2 %}{{ i }}{% endtablerow %}'
    var dst = '<table></table>'
    return expect(liquid.parseAndRender(src)).to.eventually.equal(dst)
  })

  it('should throw when tablerow not closed', function () {
    var src = '{% tablerow i in (1..0) cols:2 %}{{ i }}'
    return expect(liquid.parseAndRender(src))
      .to.be.rejectedWith(/tag .* not closed/)
  })

  it('should support tablerow with range', function () {
    var src = '{% tablerow i in (1..5) cols:2 %}{{ i }}{% endtablerow %}'
    var dst = '<table>' +
            '<tr class="row1"><td class="col1">1</td><td class="col2">2</td></tr>' +
            '<tr class="row2"><td class="col1">3</td><td class="col2">4</td></tr>' +
            '<tr class="row3"><td class="col1">5</td></tr>' +
            '</table>'
    return expect(liquid.parseAndRender(src)).to.eventually.equal(dst)
  })

  it('tablerow should throw on illegal cols 1', function () {
    var src = '{% tablerow i in (1..5) cols:0 %}{{ i }}{% endtablerow %}'
    return expect(liquid.parseAndRender(src))
      .to.be.rejectedWith(/illegal cols: 0/)
  })
  it('tablerow should throw on illegal cols 2', function () {
    var src = '{% tablerow i in (1..5) %}{{ i }}{% endtablerow %}'
    return expect(liquid.parseAndRender(src))
      .to.be.rejectedWith(/illegal cols: undefined/)
  })

  it('should support tablerow with limit', function () {
    var src = '{% tablerow i in (1..5) cols:2 limit:3 %}{{ i }}{% endtablerow %}'
    var dst = '<table>' +
            '<tr class="row1"><td class="col1">1</td><td class="col2">2</td></tr>' +
            '<tr class="row2"><td class="col1">3</td></tr>' +
            '</table>'
    return expect(liquid.parseAndRender(src)).to.eventually.equal(dst)
  })

  it('should support tablerow with offset', function () {
    var src = '{% tablerow i in (1..5) cols:2 offset:3 %}{{ i }}{% endtablerow %}'
    var dst = '<table>' +
            '<tr class="row1"><td class="col1">4</td><td class="col2">5</td></tr>' +
            '</table>'
    return expect(liquid.parseAndRender(src)).to.eventually.equal(dst)
  })
})
