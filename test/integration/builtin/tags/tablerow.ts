import { Liquid } from '../../../../src/liquid'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('tags/tablerow', function () {
  const liquid = new Liquid()

  it('should support tablerow', async function () {
    const src = '{% tablerow i in (1..3)%}{{ i }}{% endtablerow %}'
    const dst = '<tr class="row1"><td class="col1">1</td><td class="col2">2</td><td class="col3">3</td></tr>'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal(dst)
  })

  it('should support promises', async function () {
    const src = '{% tablerow i in promiseNumbers %}{{ i }}{% endtablerow %}'
    const ctx = {
      promiseNumbers: Promise.resolve([1, 2, 3])
    }
    const dst = '<tr class="row1"><td class="col1">1</td><td class="col2">2</td><td class="col3">3</td></tr>'
    const html = await liquid.parseAndRender(src, ctx)
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

  it('should throw when x in y not found', function () {
    const src = '{% tablerow i (1..3) %}{{ i }}'
    return expect(liquid.parseAndRender(src))
      .to.be.rejectedWith('illegal tag: {% tablerow i (1..3) %}, line:1, col:1')
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

  it('should support index0, index, rindex0, rindex', async function () {
    const src = '{% tablerow i in (1..3)%}{{tablerowloop.index0}}{{tablerowloop.index}}{{tablerowloop.rindex0}}{{tablerowloop.rindex}}{% endtablerow %}'
    const dst = '<tr class="row1"><td class="col1">0123</td><td class="col2">1212</td><td class="col3">2301</td></tr>'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal(dst)
  })
  it('should support first, last, length', async function () {
    const src = '{% tablerow i in (1..3)%}{{tablerowloop.first}} {{tablerowloop.last}} {{tablerowloop.length}}{% endtablerow %}'
    const dst = '<tr class="row1"><td class="col1">true false 3</td><td class="col2">false false 3</td><td class="col3">false true 3</td></tr>'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal(dst)
  })
  it('should support col, row, col0, col_first, col_last', async function () {
    const src = '{% tablerow i in (1..3)%}{{tablerowloop.col}} {{tablerowloop.col0}} {{tablerowloop.col_first}} {{tablerowloop.col_last}}{% endtablerow %}'
    const dst = '<tr class="row1"><td class="col1">1 0 true false</td><td class="col2">2 1 false false</td><td class="col3">3 2 false true</td></tr>'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal(dst)
  })
  describe('offset', function () {
    it('should support tablerow with offset', async function () {
      const src = '{% tablerow i in (1..5) cols:2 offset:3 %}{{ i }}{% endtablerow %}'
      const dst = '<tr class="row1"><td class="col1">4</td><td class="col2">5</td></tr>'
      const html = await liquid.parseAndRender(src)
      return expect(html).to.equal(dst)
    })
    it('index should also start at 1', async function () {
      const src = '{% tablerow i in (1..4) cols:2 offset:2 %}{{tablerowloop.index}}{% endtablerow %}'
      const dst = '<tr class="row1"><td class="col1">1</td><td class="col2">2</td></tr>'
      const html = await liquid.parseAndRender(src)
      return expect(html).to.equal(dst)
    })
    it('col should also start at 1', async function () {
      const src = '{% tablerow i in (1..4) cols:2 offset:3 %}{{tablerowloop.col}}{% endtablerow %}'
      const dst = '<tr class="row1"><td class="col1">1</td></tr>'
      const html = await liquid.parseAndRender(src)
      return expect(html).to.equal(dst)
    })
  })
  describe('sync support', function () {
    it('should support tablerow', function () {
      const src = '{% tablerow i in (1..3)%}{{ i }}{% endtablerow %}'
      const dst = '<tr class="row1"><td class="col1">1</td><td class="col2">2</td><td class="col3">3</td></tr>'
      const html = liquid.parseAndRenderSync(src)
      expect(html).to.equal(dst)
    })
    it('should support empty tablerow', function () {
      const src = '{% tablerow i in "" cols:2 %}{{ i }}{% endtablerow %}'
      const dst = ''
      const html = liquid.parseAndRenderSync(src)
      return expect(html).to.equal(dst)
    })
  })
})
