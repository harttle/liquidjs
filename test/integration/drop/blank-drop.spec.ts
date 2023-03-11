import { Liquid } from '../../../src/liquid'

describe('drop/blank-drop', function () {
  let liquid: Liquid
  beforeEach(() => (liquid = new Liquid()))

  it('render blank drop as blank string', async function () {
    const html = await liquid.parseAndRender('{{blank}}')
    expect(html).toBe('')
  })
  it('blank equals nil', async function () {
    const src = '{%if blank == nil %}blank == nil{%else%}blank != nil{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('blank == nil')
  })
  it('false is blank', async function () {
    const src = '{%if false == blank %}false == blank{%else%}false != blank{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('false == blank')
  })
  it('"" is blank', async function () {
    const src = '{%if "" == blank %}"" == blank{%else%}"" != blank{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('"" == blank')
  })
  it('"  " is blank', async function () {
    const src = '{%if "  " == blank %}"  " == blank{%else%}"  " != blank{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('"  " == blank')
  })
  it('{} is blank', async function () {
    const src = '{%if obj == blank %}{} == blank{%else%}{} != blank{% endif %}'
    const html = await liquid.parseAndRender(src, { obj: {} })
    expect(html).toBe('{} == blank')
  })
  it('{foo: 1} is not blank', async function () {
    const src = '{%if obj == blank %}{foo: 1} == blank{%else%}{foo: 1} != blank{% endif %}'
    const html = await liquid.parseAndRender(src, { obj: { foo: 1 } })
    expect(html).toBe('{foo: 1} != blank')
  })
  it('[] is blank', async function () {
    const src = '{%if arr == blank %}[] == blank{%else%}[] != blank{% endif %}'
    const html = await liquid.parseAndRender(src, { arr: [] })
    expect(html).toBe('[] == blank')
  })
  it('[1] is not blank', async function () {
    const src = '{%if arr == blank %}[1] == blank{%else%}[1] != blank{% endif %}'
    const html = await liquid.parseAndRender(src, { arr: [1] })
    expect(html).toBe('[1] != blank')
  })
})
