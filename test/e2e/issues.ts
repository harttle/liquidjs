import { Liquid } from '../..'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

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
})
