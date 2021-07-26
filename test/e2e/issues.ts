import { Liquid } from '../../src/liquid'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
const LiquidUMD = require('../../dist/liquid.browser.umd.js').Liquid

use(chaiAsPromised)

describe('Issues', function () {
  it('#221 unicode blanks are not properly treated', async () => {
    const engine = new Liquid({ strictVariables: true, strictFilters: true })
    const html = engine.parseAndRenderSync('{{huh | truncate: 11}}', { huh: 'fdsafdsafdsafdsaaaaa' })
    expect(html).to.equal('fdsafdsa...')
  })
  it('#252 "Not valid identifier" error for a quotes-containing identifier', async () => {
    const template = `{% capture "form_classes" -%}
      foo
    {%- endcapture %}{{form_classes}}`
    const engine = new Liquid()
    const html = await engine.parseAndRender(template)
    expect(html).to.equal('foo')
  })
  it('#259 complex property access with braces is not supported', async () => {
    const engine = new Liquid()
    const html = engine.parseAndRenderSync('{{ ["complex key"] }}', { 'complex key': 'foo' })
    expect(html).to.equal('foo')
  })
  it('#243 Potential for ReDoS through string replace function', async () => {
    const engine = new Liquid()
    const INPUT = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'
    const BROKEN_REGEX = /([a-z]+)+$/

    // string filters vulnerable to regexp parameter: split, replace, replace_first, remove_first
    const parameters = { input: INPUT, regex: BROKEN_REGEX }
    const template = `{{ input | replace:regex,'' }}`
    const html = engine.parseAndRenderSync(template, parameters)

    // should stringify the regexp rather than execute it
    expect(html).to.equal(INPUT)
  })
  it('#263 raw/endraw block not ignoring {% characters', () => {
    const template = `{% raw %}This is a code snippet showing how {% breaks the raw block.{% endraw %}`
    const engine = new Liquid()
    const html = engine.parseAndRenderSync(template)
    expect(html).to.equal('This is a code snippet showing how {% breaks the raw block.')
  })
  it('#268 elsif is not supported for unless', () => {
    const template = `{%- unless condition1 -%}
    <div>X</div>
    {%- elsif condition2 -%}
        <div>Y</div>
    {%- else %}
        <div>Z</div>
    {% endunless %}`
    const engine = new Liquid()
    const html = engine.parseAndRenderSync(template, { condition1: true, condition2: true })
    expect(html).to.equal('<div>Y</div>')
  })
  it('#277 Passing liquid in FilterImpl', () => {
    const engine = new Liquid()
    engine.registerFilter('render', function (this: any, template: string, name: string) {
      return this.liquid.parseAndRenderSync(decodeURIComponent(template), { name })
    })
    const html = engine.parseAndRenderSync(
      `{{ subtemplate | render: "foo" }}`,
      { subtemplate: encodeURIComponent('hello {{ name }}') }
    )
    expect(html).to.equal('hello foo')
  })
  it('#288 Unexpected behavior when string literals contain }}', async () => {
    const engine = new Liquid()
    const html = await engine.parseAndRender(`{{ '{{' }}{{ '}}' }}`)
    expect(html).to.equal('{{}}')
  })
  it('#222 Support function calls', async () => {
    const engine = new Liquid()
    const html = await engine.parseAndRender(
      `{{ obj.property }}`,
      { obj: { property: () => 'BAR' } }
    )
    expect(html).to.equal('BAR')
  })
  it('#313 lenientIf not working as expected in umd', async () => {
    const engine = new LiquidUMD({
      strictVariables: true,
      lenientIf: true
    })
    const html = await engine.parseAndRender(`{{ name | default: "default name" }}`)
    expect(html).to.equal('default name')
  })
  it('#321 comparison for empty/nil', async () => {
    const engine = new Liquid()
    const html = await engine.parseAndRender(
      '{% if empty == nil %}true{%else%}false{%endif%}' +
      '{% if nil == empty %}true{%else%}false{%endif%}'
    )
    expect(html).to.equal('falsefalse')
  })
  it('#320 newline_to_br filter should output <br /> instead of <br/>', async () => {
    const engine = new Liquid()
    const html = await engine.parseAndRender(
      `{{ 'a \n b \n c' | newline_to_br | split: '<br />' }}`
    )
    expect(html).to.equal('a ,\n b ,\n c')
  })
  it('#342 New lines in logical operator', async () => {
    const engine = new Liquid()
    const tpl = `{%\r\nif\r\ntrue\r\nor\r\nfalse\r\n%}\r\ntrue\r\n{%\r\nendif\r\n%}`
    const html = await engine.parseAndRender(tpl)
    expect(html).to.equal('\r\ntrue\r\n')
  })
})
