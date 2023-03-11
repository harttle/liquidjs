import { Liquid } from '../../../src/liquid'

describe('drop/null-drop', function () {
  let liquid: Liquid
  beforeEach(() => (liquid = new Liquid()))

  it('render nil as empty string', async function () {
    const html = await liquid.parseAndRender('{{nil}}')
    expect(html).toBe('')
  })
  it('render null as empty string', async function () {
    const html = await liquid.parseAndRender('{{null}}')
    expect(html).toBe('')
  })
  it('undefined == null', async function () {
    const src = '{%if foo == nil %}foo == nil{%else%}foo != nil{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('foo == nil')
  })
  it('nil != blank', async function () {
    const src = '{%if nil == blank %}eq{%else%}neq{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('neq')
  })
  it('nil != empty', async function () {
    const src = '{%if nil == empty %}eq{%else%}neq{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('neq')
  })
  it('0 != null', async function () {
    const src = '{%if 0 == null %}0 == null{%else%}0 != null{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('0 != null')
  })
  it('nil == null', async function () {
    const src = '{%if nil == null %}nil == null{%else%}nil != null{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('nil == null')
  })
})
