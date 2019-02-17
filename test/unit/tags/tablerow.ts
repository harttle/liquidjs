import Liquid from 'src/liquid'
import { expect } from 'chai'

describe('tags/tablerow', function () {
  const liquid = new Liquid()

  it('should support tablerow', async function () {
    const src = '{% tablerow i in (1..3)%}{{ i }}{% endtablerow %}'
    const dst = '<tr class="row1"><td class="col1">1</td><td class="col2">2</td><td class="col3">3</td></tr>'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal(dst)
  })

  it('should support cols', async function () {
    const src = '{% tablerow i in alpha cols:2 %}{{ i }}{% endtablerow %}'
    const ctx = {
      alpha: ['a', 'b', 'c']
    }
    const dst =
      '<tr class="row1"><td class="col1">a</td><td class="col2">b</td></tr>' +
      '<tr class="row2"><td class="col1">c</td></tr>'
    const html = await liquid.parseAndRender(src, ctx)
    return expect(html).to.equal(dst)
  })

  it('should support cols set to 0', async function () {
    const src = '{% tablerow i in (1..3) cols:0 %}{{ i }}{% endtablerow %}'
    const dst = '<tr class="row1"><td class="col1">1</td><td class="col2">2</td><td class="col3">3</td></tr>'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal(dst)
  })

  it('should support empty tablerow', async function () {
    const src = '{% tablerow i in (1..0) cols:2 %}{{ i }}{% endtablerow %}'
    const dst = ''
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal(dst)
  })

  it('should support empty array', async function () {
    const src = '{% tablerow i in alpha.z cols:2 %}{{ i }}{% endtablerow %}'
    const dst = ''
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal(dst)
  })

  it('should throw when tablerow not closed', function () {
    const src = '{% tablerow i in (1..0) cols:2 %}{{ i }}'
    return expect(liquid.parseAndRender(src))
      .to.be.rejectedWith(/tag .* not closed/)
  })

  it('should support tablerow with range', async function () {
    const src = '{% tablerow i in (1..5) cols:2 %}{{ i }}{% endtablerow %}'
    const dst =
      '<tr class="row1"><td class="col1">1</td><td class="col2">2</td></tr>' +
      '<tr class="row2"><td class="col1">3</td><td class="col2">4</td></tr>' +
      '<tr class="row3"><td class="col1">5</td></tr>'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal(dst)
  })

  it('should support tablerow with limit', async function () {
    const src = '{% tablerow i in (1..5) cols:2 limit:3 %}{{ i }}{% endtablerow %}'
    const dst =
      '<tr class="row1"><td class="col1">1</td><td class="col2">2</td></tr>' +
      '<tr class="row2"><td class="col1">3</td></tr>'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal(dst)
  })

  it('should support tablerow with offset', async function () {
    const src = '{% tablerow i in (1..5) cols:2 offset:3 %}{{ i }}{% endtablerow %}'
    const dst = '<tr class="row1"><td class="col1">4</td><td class="col2">5</td></tr>'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal(dst)
  })
})
