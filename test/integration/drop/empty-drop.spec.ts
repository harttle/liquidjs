import { Liquid } from '../../../src/liquid'

describe('drop/empty-drop', function () {
  let liquid: Liquid
  beforeEach(() => (liquid = new Liquid()))

  it('render empty drop as empty string', async function () {
    const html = await liquid.parseAndRender('{{empty}}')
    expect(html).toBe('')
  })
  it('nil is not empty', async function () {
    const src = '{%if nil == empty %}nil == empty{%else%}nil != empty{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('nil != empty')
  })
  it('false is not empty', async function () {
    const src = '{%if false == empty %}false == empty{%else%}false != empty{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('false != empty')
  })
  it('"" is empty', async function () {
    const src = '{%if "" == empty %}"" == empty{%else%}"" != empty{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('"" == empty')
  })
  it('"  " is not empty', async function () {
    const src = '{%if "  " == empty %}"  " == empty{%else%}"  " != empty{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('"  " != empty')
  })
  it('{} is empty', async function () {
    const src = '{%if obj == empty %}{} == empty{%else%}{} != empty{% endif %}'
    const html = await liquid.parseAndRender(src, { obj: {} })
    expect(html).toBe('{} == empty')
  })
  it('{foo: 1} is not empty', async function () {
    const src = '{%if obj == empty %}{foo: 1} == empty{%else%}{foo: 1} != empty{% endif %}'
    const html = await liquid.parseAndRender(src, { obj: { foo: 1 } })
    expect(html).toBe('{foo: 1} != empty')
  })
  it('[] is empty', async function () {
    const src = '{%if arr == empty %}[] == empty{%else%}[] != empty{% endif %}'
    const html = await liquid.parseAndRender(src, { arr: [] })
    expect(html).toBe('[] == empty')
  })
  it('[1] is not empty', async function () {
    const src = '{%if arr == empty %}[1] == empty{%else%}[1] != empty{% endif %}'
    const html = await liquid.parseAndRender(src, { arr: [1] })
    expect(html).toBe('[1] != empty')
  })
  it('1 < empty should be false', async function () {
    const src = '{%if 1 < empty %}true{%else%}false{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('false')
  })
  it('1 <= empty should be false', async function () {
    const src = '{%if 1 <= empty %}true{%else%}false{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('false')
  })
  it('1 > empty should be false', async function () {
    const src = '{%if 1 > empty %}true{%else%}false{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('false')
  })
  it('1 >= empty should be false', async function () {
    const src = '{%if 1 >= empty %}true{%else%}false{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('false')
  })
  it('1 == empty should be false', async function () {
    const src = '{%if 1 == empty %}true{%else%}false{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('false')
  })
  it('1 != empty should be true', async function () {
    const src = '{%if 1 != empty %}true{%else%}false{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('true')
  })
  it('empty != empty', async function () {
    const src = '{%if empty == empty %}true{%else%}false{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('false')
  })
  it('empty != nil', async function () {
    const src = '{%if empty == nil %}true{%else%}false{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('false')
  })
})
