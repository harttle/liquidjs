import { Liquid } from '../..'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
const LiquidUMD = require('../../dist/liquid.browser.umd.js').Liquid

use(chaiAsPromised)
use(sinonChai)

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
  it('#401 Timezone Offset Issue', async () => {
    const engine = new Liquid({ timezoneOffset: -600 })
    const tpl = engine.parse('{{ date | date: "%Y-%m-%d %H:%M %p %z" }}')
    const html = await engine.render(tpl, { date: '2021-10-06T15:31:00+08:00' })
    expect(html).to.equal('2021-10-06 17:31 PM +1000')
  })
  it('#412 Pass root as it is to `resolve`', async () => {
    const engine = new Liquid({
      root: '/tmp',
      fs: {
        readFileSync: (file: string) => file,
        async readFile (file: string) { return 'foo' },
        existsSync (file: string) { return true },
        async exists (file: string) { return true },
        resolve: (dir: string, file: string) => dir + '/' + file
      }
    })
    const tpl = engine.parse('{% include "foo.liquid" %}')
    const html = await engine.renderSync(tpl)
    expect(html).to.equal('/tmp/foo.liquid')
  })
  it('#416 Templates imported by {% render %} not cached for concurrent async render', async () => {
    const readFile = sinon.spy(() => Promise.resolve('HELLO'))
    const exists = sinon.spy(() => 'HELLO')
    const engine = new Liquid({
      cache: true,
      extname: '.liquid',
      root: '~',
      fs: {
        exists,
        resolve: (root: string, file: string, ext: string) => root + '#' + file + ext,
        sep: '#',
        readFile
      } as any
    })

    await Promise.all(Array(5).fill(0).map(
      x => engine.parseAndRender("{% render 'template' %}")
    ))
    expect(exists).to.be.calledOnce
    expect(readFile).to.be.calledOnce
  })
  it('#431 Error when using Date timezoneOffset in 9.28.5', async () => {
    const engine = new Liquid({
      timezoneOffset: 0,
      preserveTimezones: true
    })
    const tpl = engine.parse('Welcome to {{ now | date: "%Y-%m-%d" }}!')
    expect(engine.render(tpl, { now: new Date('2019/02/01') })).to.eventually.equal('Welcome to 2019-02-01')
  })
  it('#433 Support Jekyll-like includes', async () => {
    const engine = new Liquid({
      dynamicPartials: false,
      root: '/tmp',
      fs: {
        readFileSync: (file: string) => file,
        async readFile (file: string) { return `CONTENT for ${file}` },
        existsSync (file: string) { return true },
        async exists (file: string) { return true },
        resolve: (dir: string, file: string) => dir + '/' + file
      }
    })
    const tpl = engine.parse('{% include prefix/{{ my_variable | append: "-bar" }}/suffix %}')
    const html = await engine.render(tpl, { my_variable: 'foo' })
    expect(html).to.equal('CONTENT for /tmp/prefix/foo-bar/suffix')
  })
  it('#428 Implement liquid/echo tags', () => {
    const template = `{%- liquid
      for value in array
        assign double_value = value | times: 2
        echo double_value | times: 2
        unless forloop.last
          echo '#'
        endunless
      endfor
    
      echo '#'
      echo double_value
    -%}`
    const engine = new Liquid()
    const html = engine.parseAndRenderSync(template, { array: [1, 2, 3] })
    expect(html).to.equal('4#8#12#6')
  })
})
