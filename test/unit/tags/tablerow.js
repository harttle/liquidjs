import Liquid from '../../../src'
import * as chai from 'chai'

const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/tablerow', function () {
  const liquid = Liquid()

  it('should support tablerow', function () {
    const src = '{% tablerow i in (1..3)%}{{ i }}{% endtablerow %}'
    const dst = '<tr class="row1"><td class="col1">1</td><td class="col2">2</td><td class="col3">3</td></tr>'
    return expect(liquid.parseAndRender(src)).to.eventually.equal(dst)
  })

  it('should support cols', function () {
    const src = '{% tablerow i in alpha cols:2 %}{{ i }}{% endtablerow %}'
    const ctx = {
      alpha: ['a', 'b', 'c']
    }
    const dst =
      '<tr class="row1"><td class="col1">a</td><td class="col2">b</td></tr>' +
      '<tr class="row2"><td class="col1">c</td></tr>'
    return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(dst)
  })

  it('should support cols set to 0', function () {
    const src = '{% tablerow i in (1..3) cols:0 %}{{ i }}{% endtablerow %}'
    const dst = '<tr class="row1"><td class="col1">1</td><td class="col2">2</td><td class="col3">3</td></tr>'
    return expect(liquid.parseAndRender(src)).to.eventually.equal(dst)
  })

  it('should support empty tablerow', function () {
    const src = '{% tablerow i in (1..0) cols:2 %}{{ i }}{% endtablerow %}'
    const dst = ''
    return expect(liquid.parseAndRender(src)).to.eventually.equal(dst)
  })

  it('should support empty array', function () {
    const src = '{% tablerow i in alpha.z cols:2 %}{{ i }}{% endtablerow %}'
    const dst = ''
    return expect(liquid.parseAndRender(src)).to.eventually.equal(dst)
  })

  it('should throw when tablerow not closed', function () {
    const src = '{% tablerow i in (1..0) cols:2 %}{{ i }}'
    return expect(liquid.parseAndRender(src))
      .to.be.rejectedWith(/tag .* not closed/)
  })

  it('should support tablerow with range', function () {
    const src = '{% tablerow i in (1..5) cols:2 %}{{ i }}{% endtablerow %}'
    const dst =
      '<tr class="row1"><td class="col1">1</td><td class="col2">2</td></tr>' +
      '<tr class="row2"><td class="col1">3</td><td class="col2">4</td></tr>' +
      '<tr class="row3"><td class="col1">5</td></tr>'
    return expect(liquid.parseAndRender(src)).to.eventually.equal(dst)
  })

  it('should support tablerow with limit', function () {
    const src = '{% tablerow i in (1..5) cols:2 limit:3 %}{{ i }}{% endtablerow %}'
    const dst =
      '<tr class="row1"><td class="col1">1</td><td class="col2">2</td></tr>' +
      '<tr class="row2"><td class="col1">3</td></tr>'
    return expect(liquid.parseAndRender(src)).to.eventually.equal(dst)
  })

  it('should support tablerow with offset', function () {
    const src = '{% tablerow i in (1..5) cols:2 offset:3 %}{{ i }}{% endtablerow %}'
    const dst = '<tr class="row1"><td class="col1">4</td><td class="col2">5</td></tr>'
    return expect(liquid.parseAndRender(src)).to.eventually.equal(dst)
  })
})
