import { Liquid } from '../../../src/liquid'
import { Context } from '../../../src/context/context'
import { mock, restore } from '../../stub/mockfs'

describe('tags/tablerow', function () {
  const liquid = new Liquid()

  it('should support tablerow', async function () {
    const src = '{% tablerow i in (1..3)%}{{ i }}{% endtablerow %}'
    const dst = '<tr class="row1"><td class="col1">1</td><td class="col2">2</td><td class="col3">3</td></tr>'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe(dst)
  })

  it('should support promises', async function () {
    const src = '{% tablerow i in promiseNumbers %}{{ i }}{% endtablerow %}'
    const ctx = {
      promiseNumbers: Promise.resolve([1, 2, 3])
    }
    const dst = '<tr class="row1"><td class="col1">1</td><td class="col2">2</td><td class="col3">3</td></tr>'
    const html = await liquid.parseAndRender(src, ctx)
    return expect(html).toBe(dst)
  })

  it('should support iterables', async function () {
    class MockIterable {
      * [Symbol.iterator] () {
        yield 1
        yield 2
        yield 3
      }
    }
    const src = '{% tablerow i in someIterable %}{{ i }}{% endtablerow %}'
    const ctx = {
      someIterable: new MockIterable()
    }
    const dst = '<tr class="row1"><td class="col1">1</td><td class="col2">2</td><td class="col3">3</td></tr>'
    const html = await liquid.parseAndRender(src, ctx)
    return expect(html).toBe(dst)
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
    return expect(html).toBe(dst)
  })

  it('should support cols set to 0', async function () {
    const src = '{% tablerow i in (1..3) cols:0 %}{{ i }}{% endtablerow %}'
    const dst = '<tr class="row1"><td class="col1">1</td><td class="col2">2</td><td class="col3">3</td></tr>'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe(dst)
  })

  it('should support empty tablerow', async function () {
    const src = '{% tablerow i in (1..0) cols:2 %}{{ i }}{% endtablerow %}'
    const dst = ''
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe(dst)
  })

  it('should support empty array', async function () {
    const src = '{% tablerow i in alpha.z cols:2 %}{{ i }}{% endtablerow %}'
    const dst = ''
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe(dst)
  })

  it('should throw when tablerow not closed', function () {
    const src = '{% tablerow i in (1..0) cols:2 %}{{ i }}'
    return expect(liquid.parseAndRender(src))
      .rejects.toThrow(/tag .* not closed/)
  })

  it('should throw when x in y not found', function () {
    const src = '{% tablerow i (1..3) %}{{ i }}'
    return expect(liquid.parseAndRender(src))
      .rejects.toThrow('illegal tag: {% tablerow i (1..3) %}, line:1, col:1')
  })

  it('should support tablerow with range', async function () {
    const src = '{% tablerow i in (1..5) cols:2 %}{{ i }}{% endtablerow %}'
    const dst =
      '<tr class="row1"><td class="col1">1</td><td class="col2">2</td></tr>' +
      '<tr class="row2"><td class="col1">3</td><td class="col2">4</td></tr>' +
      '<tr class="row3"><td class="col1">5</td></tr>'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe(dst)
  })

  it('should support tablerow with limit', async function () {
    const src = '{% tablerow i in (1..5) cols:2 limit:3 %}{{ i }}{% endtablerow %}'
    const dst =
      '<tr class="row1"><td class="col1">1</td><td class="col2">2</td></tr>' +
      '<tr class="row2"><td class="col1">3</td></tr>'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe(dst)
  })

  it('should support index0, index, rindex0, rindex', async function () {
    const src = '{% tablerow i in (1..3)%}{{tablerowloop.index0}}{{tablerowloop.index}}{{tablerowloop.rindex0}}{{tablerowloop.rindex}}{% endtablerow %}'
    const dst = '<tr class="row1"><td class="col1">0123</td><td class="col2">1212</td><td class="col3">2301</td></tr>'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe(dst)
  })
  it('should support first, last, length', async function () {
    const src = '{% tablerow i in (1..3)%}{{tablerowloop.first}} {{tablerowloop.last}} {{tablerowloop.length}}{% endtablerow %}'
    const dst = '<tr class="row1"><td class="col1">true false 3</td><td class="col2">false false 3</td><td class="col3">false true 3</td></tr>'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe(dst)
  })
  it('should support col, row, col0, col_first, col_last', async function () {
    const src = '{% tablerow i in (1..3)%}{{tablerowloop.col}} {{tablerowloop.col0}} {{tablerowloop.col_first}} {{tablerowloop.col_last}}{% endtablerow %}'
    const dst = '<tr class="row1"><td class="col1">1 0 true false</td><td class="col2">2 1 false false</td><td class="col3">3 2 false true</td></tr>'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe(dst)
  })
  describe('offset', function () {
    it('should support tablerow with offset', async function () {
      const src = '{% tablerow i in (1..5) cols:2 offset:3 %}{{ i }}{% endtablerow %}'
      const dst = '<tr class="row1"><td class="col1">4</td><td class="col2">5</td></tr>'
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe(dst)
    })
    it('index should also start at 1', async function () {
      const src = '{% tablerow i in (1..4) cols:2 offset:2 %}{{tablerowloop.index}}{% endtablerow %}'
      const dst = '<tr class="row1"><td class="col1">1</td><td class="col2">2</td></tr>'
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe(dst)
    })
    it('col should also start at 1', async function () {
      const src = '{% tablerow i in (1..4) cols:2 offset:3 %}{{tablerowloop.col}}{% endtablerow %}'
      const dst = '<tr class="row1"><td class="col1">1</td></tr>'
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe(dst)
    })
    it('should not skip items for a negative offset', async function () {
      const src = '{% tablerow i in (1..3) offset:-1 %}{{ i }}{% endtablerow %}'
      const dst = '<tr class="row1"><td class="col1">1</td><td class="col2">2</td><td class="col3">3</td></tr>'
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe(dst)
    })
    it('should count limit from a negative offset', async function () {
      const src = '{% tablerow i in (1..3) offset:-1 limit:2 %}{{ i }}{% endtablerow %}'
      const dst = '<tr class="row1"><td class="col1">1</td></tr>'
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe(dst)
    })
    it('should render nothing for a negative limit', async function () {
      const src = '{% tablerow i in (1..3) limit:-1 %}{{ i }}{% endtablerow %}'
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe('')
    })
  })
  describe('break', function () {
    afterEach(restore)
    it('should support break', async function () {
      const src = '{% tablerow n in (1..3) cols:2 %}{{n}}{% break %}{{n}}{% endtablerow %}'
      const dst = '<tr class="row1"><td class="col1">1</td></tr>'
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe(dst)
    })

    it('should close the current row without opening an empty next row when breaking at col_last', async function () {
      const src = '{% tablerow n in (1..4) cols:2 %}{% if n == 2 %}stop{% break %}{% endif %}{{ n }}{% endtablerow %}'
      const dst = '<tr class="row1"><td class="col1">1</td><td class="col2">stop</td></tr>'
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe(dst)
    })

    it('should support break on a later row', async function () {
      const src = '{% tablerow n in (1..4) cols:2 %}{{ n }}{% if n == 3 %}{% break %}{% endif %}{% endtablerow %}'
      const dst = '<tr class="row1"><td class="col1">1</td><td class="col2">2</td></tr><tr class="row2"><td class="col1">3</td></tr>'
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe(dst)
    })

    it('should not break template outside of tablerow', async function () {
      const src = '{% tablerow n in (1..3) cols:2 %}{{ n }}{% break %}{% endtablerow %} after'
      const dst = '<tr class="row1"><td class="col1">1</td></tr> after'
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe(dst)
    })

    it('should not break parent for loop', async function () {
      const src = '{% for i in (1..2) %}{% for j in (1..2) %}{% tablerow k in (1..3) %}{% break %}{% endtablerow %}j={{ j }};{% endfor %}i={{ i }};{% endfor %}after'
      const cell = '<tr class="row1"><td class="col1"></td></tr>'
      const dst = `${cell}j=1;${cell}j=2;i=1;${cell}j=1;${cell}j=2;i=2;after`
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe(dst)
    })

    it('should not break parent tablerow', async function () {
      const src = '{% tablerow i in (1..2) %}{% tablerow j in (1..2) %}{{ j }}{% break %}{% endtablerow %}-{{ i }}{% endtablerow %}'
      const inner = '<tr class="row1"><td class="col1">1</td></tr>'
      const dst = `<tr class="row1"><td class="col1">${inner}-1</td><td class="col2">${inner}-2</td></tr>`
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe(dst)
    })

    it('should break tablerow for included break', async function () {
      mock({
        'snippet.liquid': 'before{% break %}skipped'
      })
      const src = '{% tablerow n in (1..2) %}{% include "snippet.liquid" %} after{% endtablerow %} done'
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe('<tr class="row1"><td class="col1">before</td></tr> done')
    })

    it('should only exit snippet for rendered break', async function () {
      mock({
        'snippet.liquid': 'before{% break %}skipped'
      })
      const src = '{% tablerow n in (1..2) %}{% render "snippet.liquid" %} after{% endtablerow %}'
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe('<tr class="row1"><td class="col1">before after</td><td class="col2">before after</td></tr>')
    })
  })

  describe('continue', function () {
    afterEach(restore)
    it('should support continue', async function () {
      const src = '{% tablerow n in (1..3) cols:2 %}[{{n}}]{% continue %}{{n}}{% endtablerow %} after'
      const dst =
        '<tr class="row1"><td class="col1">[1]</td><td class="col2">[2]</td></tr>' +
        '<tr class="row2"><td class="col1">[3]</td></tr> after'
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe(dst)
    })

    it('should reset continue flag on subsequent iterations', async function () {
      const src = '{% tablerow n in (1..3) cols:2 %}{% if n == 1 %}{% continue %}{% endif %}{{ n }}{% endtablerow %}'
      const dst =
        '<tr class="row1"><td class="col1"></td><td class="col2">2</td></tr>' +
        '<tr class="row2"><td class="col1">3</td></tr>'
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe(dst)
    })

    it('should not leak continue outside of tablerow or into parent for loop', async function () {
      const src = '{% for i in (1..2) %}{% tablerow n in (1..2) %}{% if n == 2 %}{% continue %}{% endif %}{{ n }}{% endtablerow %}after{{ i }};{% endfor %}'
      const table = '<tr class="row1"><td class="col1">1</td><td class="col2"></td></tr>'
      const dst = `${table}after1;${table}after2;`
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe(dst)
    })

    it('should not leak continue to parent tablerow', async function () {
      const src = '{% tablerow i in (1..2) %}{% tablerow j in (1..2) %}{{ j }}{% continue %}x{% endtablerow %}-{{ i }}{% endtablerow %}'
      const inner = '<tr class="row1"><td class="col1">1</td><td class="col2">2</td></tr>'
      const dst = `<tr class="row1"><td class="col1">${inner}-1</td><td class="col2">${inner}-2</td></tr>`
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe(dst)
    })

    it('should skip tablerow body for included continue', async function () {
      mock({
        'snippet.liquid': 'before{% continue %}skipped'
      })
      const src = '{% tablerow n in (1..2) %}{% include "snippet.liquid" %} after{% endtablerow %} done'
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe('<tr class="row1"><td class="col1">before</td><td class="col2">before</td></tr> done')
    })

    it('should only exit snippet for rendered continue', async function () {
      mock({
        'snippet.liquid': 'before{% continue %}skipped'
      })
      const src = '{% tablerow n in (1..2) %}{% render "snippet.liquid" %} after{% endtablerow %}'
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe('<tr class="row1"><td class="col1">before after</td><td class="col2">before after</td></tr>')
    })
  })

  it('should pop scope and reset loop flags when rendering throws', async function () {
    const engine = new Liquid()
    engine.registerTag('throwingTag', {
      render (ctx) {
        ctx.breakCalled = true
        ctx.continueCalled = true
        throw new Error('intended render error')
      }
    })
    const ctx = new Context({})
    await expect(engine.parseAndRender('{% tablerow i in (1..1) %}{% throwingTag %}{% endtablerow %}', ctx))
      .rejects.toThrow('intended render error')
    expect(ctx.breakCalled).toBe(false)
    expect(ctx.continueCalled).toBe(false)
    const html = await engine.parseAndRender('{{ tablerowloop }}ok', ctx)
    expect(html).toBe('ok')
  })

  describe('sync support', function () {
    it('should support tablerow', function () {
      const src = '{% tablerow i in (1..3)%}{{ i }}{% endtablerow %}'
      const dst = '<tr class="row1"><td class="col1">1</td><td class="col2">2</td><td class="col3">3</td></tr>'
      const html = liquid.parseAndRenderSync(src)
      expect(html).toBe(dst)
    })
    it('should support empty tablerow', function () {
      const src = '{% tablerow i in "" cols:2 %}{{ i }}{% endtablerow %}'
      const dst = ''
      const html = liquid.parseAndRenderSync(src)
      return expect(html).toBe(dst)
    })
    it('should support break', function () {
      const src = '{% tablerow n in (1..3) cols:2 %}{{n}}{% break %}{{n}}{% endtablerow %} after'
      const dst = '<tr class="row1"><td class="col1">1</td></tr> after'
      const html = liquid.parseAndRenderSync(src)
      expect(html).toBe(dst)
    })
    it('should support continue', function () {
      const src = '{% tablerow n in (1..3) cols:2 %}{% if n == 1 %}{% continue %}{% endif %}{{ n }}{% endtablerow %} after'
      const dst = '<tr class="row1"><td class="col1"></td><td class="col2">2</td></tr><tr class="row2"><td class="col1">3</td></tr> after'
      const html = liquid.parseAndRenderSync(src)
      expect(html).toBe(dst)
    })
  })
})
