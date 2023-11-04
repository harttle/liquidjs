import { TopLevelToken, TagToken, Tokenizer, Context, Liquid, Drop, toValueSync } from '../..'
const LiquidUMD = require('../../dist/liquid.browser.umd.js').Liquid

describe('Issues', function () {
  it('#221 unicode blanks are not properly treated', async () => {
    const engine = new Liquid({ strictVariables: true, strictFilters: true })
    const html = engine.parseAndRenderSync('{{huh | truncate: 11}}', { huh: 'fdsafdsafdsafdsaaaaa' })
    expect(html).toBe('fdsafdsa...')
  })
  it('#252 "Not valid identifier" error for a quotes-containing identifier', async () => {
    const template = `{% capture "form_classes" -%}
      foo
    {%- endcapture %}{{form_classes}}`
    const engine = new Liquid()
    const html = await engine.parseAndRender(template)
    expect(html).toBe('foo')
  })
  it('#259 complex property access with braces is not supported', async () => {
    const engine = new Liquid()
    const html = engine.parseAndRenderSync('{{ ["complex key"] }}', { 'complex key': 'foo' })
    expect(html).toBe('foo')
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
    expect(html).toBe(INPUT)
  })
  it('#263 raw/endraw block not ignoring {% characters', () => {
    const template = `{% raw %}This is a code snippet showing how {% breaks the raw block.{% endraw %}`
    const engine = new Liquid()
    const html = engine.parseAndRenderSync(template)
    expect(html).toBe('This is a code snippet showing how {% breaks the raw block.')
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
    expect(html).toBe('<div>Y</div>')
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
    expect(html).toBe('hello foo')
  })
  it('#288 Unexpected behavior when string literals contain }}', async () => {
    const engine = new Liquid()
    const html = await engine.parseAndRender(`{{ '{{' }}{{ '}}' }}`)
    expect(html).toBe('{{}}')
  })
  it('#222 Support function calls', async () => {
    const engine = new Liquid()
    const html = await engine.parseAndRender(
      `{{ obj.property }}`,
      { obj: { property: () => 'BAR' } }
    )
    expect(html).toBe('BAR')
  })
  it('#313 lenientIf not working as expected in umd', async () => {
    const engine = new LiquidUMD({
      strictVariables: true,
      lenientIf: true
    })
    const html = await engine.parseAndRender(`{{ name | default: "default name" }}`)
    expect(html).toBe('default name')
  })
  it('#321 comparison for empty/nil', async () => {
    const engine = new Liquid()
    const html = await engine.parseAndRender(
      '{% if empty == nil %}true{%else%}false{%endif%}' +
      '{% if nil == empty %}true{%else%}false{%endif%}'
    )
    expect(html).toBe('falsefalse')
  })
  it('#320 newline_to_br filter should output <br /> instead of <br/>', async () => {
    const engine = new Liquid()
    const html = await engine.parseAndRender(
      `{{ 'a \n b \n c' | newline_to_br | split: '<br />' }}`
    )
    expect(html).toBe('a \n b \n c')
  })
  it('#342 New lines in logical operator', async () => {
    const engine = new Liquid()
    const tpl = `{%\r\nif\r\ntrue\r\nor\r\nfalse\r\n%}\r\ntrue\r\n{%\r\nendif\r\n%}`
    const html = await engine.parseAndRender(tpl)
    expect(html).toBe('\r\ntrue\r\n')
  })
  it('#401 Timezone Offset Issue', async () => {
    const engine = new Liquid({ timezoneOffset: -600 })
    const tpl = engine.parse('{{ date | date: "%Y-%m-%d %H:%M %p %z" }}')
    const html = await engine.render(tpl, { date: '2021-10-06T15:31:00+08:00' })
    expect(html).toBe('2021-10-06 17:31 PM +1000')
  })
  it('#412 Pass root as it is to `resolve`', async () => {
    const engine = new Liquid({
      root: '/tmp',
      relativeReference: false,
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
    expect(html).toBe('/tmp/foo.liquid')
  })
  it('#416 Templates imported by {% render %} not cached for concurrent async render', async () => {
    const readFile = jest.fn(() => Promise.resolve('HELLO'))
    const exists = jest.fn(() => 'HELLO')
    const engine = new Liquid({
      cache: true,
      extname: '.liquid',
      root: '~',
      relativeReference: false,
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
    expect(exists).toHaveBeenCalledTimes(1)
    expect(readFile).toHaveBeenCalledTimes(1)
  })
  it('#431 Error when using Date timezoneOffset in 9.28.5', () => {
    const engine = new Liquid({
      timezoneOffset: 0,
      preserveTimezones: true
    })
    const tpl = engine.parse('Welcome to {{ now | date: "%Y-%m-%d" }}')
    return expect(engine.render(tpl, { now: new Date('2019-02-01T00:00:00.000Z') })).resolves.toBe('Welcome to 2019-02-01')
  })
  it('#433 Support Jekyll-like includes', async () => {
    const engine = new Liquid({
      dynamicPartials: false,
      relativeReference: false,
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
    expect(html).toBe('CONTENT for /tmp/prefix/foo-bar/suffix')
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
    expect(html).toBe('4#8#12#6')
  })
  it('#454 leaking JS prototype getter functions in evaluation', async () => {
    const engine = new Liquid({ ownPropertyOnly: true })
    const html = engine.parseAndRenderSync('{{foo | size}}-{{bar.coo}}', { foo: 'foo', bar: Object.create({ coo: 'COO' }) })
    expect(html).toBe('3-')
  })
  it('#465 Liquidjs divided_by not compatible with Ruby/Shopify Liquid', () => {
    const engine = new Liquid({ ownPropertyOnly: true })
    const html = engine.parseAndRenderSync('{{ 5 | divided_by: 3, true }}')
    expect(html).toBe('1')
  })
  it('#479 url_encode throws on undefined value', async () => {
    const engine = new Liquid({
      strictVariables: false
    })
    const tpl = engine.parse('{{ v | url_encode }}')
    const html = await engine.render(tpl, { v: undefined })
    expect(html).toBe('')
  })
  it('#481 filters that should not throw', async () => {
    const engine = new Liquid()
    const tpl = engine.parse(`
      {{ foo | join }}
      {{ foo | map: "k" }}
      {{ foo | reverse }}
      {{ foo | slice: 2 }}
      {{ foo | newline_to_br }}
      {{ foo | strip_html }}
      {{ foo | truncatewords }}
      {{ foo | concat | json }}
    `)
    const html = await engine.render(tpl, { foo: undefined })
    expect(html.trim()).toBe('[]')
  })
  it('#481 concat should always return an array', async () => {
    const engine = new Liquid()
    const html = await engine.parseAndRender(`{{ foo | concat | json }}`)
    expect(html).toBe('[]')
  })
  it('#486 Access array items from the right with negative indexes', async () => {
    const engine = new Liquid()
    const html = await engine.parseAndRender(`{% assign a = "x,y,z" | split: ',' -%}{{ a[-1] }} {{ a[-3] }} {{ a[-8] }}`)
    expect(html).toBe('z x ')
  })
  it('#492 contains operator does not support Drop', async () => {
    class TemplateDrop extends Drop {
      valueOf () { return 'product' }
    }
    const engine = new Liquid()
    const ctx = { template: new TemplateDrop() }
    const html = await engine.parseAndRender(`{% if template contains "product" %}contains{%endif%}`, ctx)
    expect(html).toBe('contains')
  })
  it('#513 should support large number of templates [async]', async () => {
    const engine = new Liquid()
    const html = await engine.parseAndRender(`{% for i in (1..10000) %}{{ i }}{% endfor %}`)
    expect(html).toHaveLength(38894)
  })
  it('#513 should support large number of templates [sync]', () => {
    const engine = new Liquid()
    const html = engine.parseAndRenderSync(`{% for i in (1..10000) %}{{ i }}{% endfor %}`)
    expect(html).toHaveLength(38894)
  })
  it('#519 should throw parse error for invalid assign expression', () => {
    const engine = new Liquid()
    expect(() => engine.parse('{% assign headshot = https://testurl.com/not_enclosed_in_quotes.jpg %}')).toThrow(/expected "|" before filter, line:1, col:27/)
  })
  it('#527 export Liquid Expression', () => {
    const tokenizer = new Tokenizer('a > b')
    const expression = tokenizer.readExpression()
    const result = toValueSync(expression.evaluate(new Context({ a: 1, b: 2 })))
    expect(result).toBe(false)
  })
  it('#527 export Liquid Expression (evalValue)', async () => {
    const liquid = new Liquid()
    const result = await liquid.evalValue('a > b', { a: 1, b: 2 })
    expect(result).toBe(false)
  })
  it('#527 export Liquid Expression (evalValueSync)', async () => {
    const liquid = new Liquid()
    const result = liquid.evalValueSync('a > b', { a: 1, b: 2 })
    expect(result).toBe(false)
  })
  it('#276 Promise support in expressions', async () => {
    const liquid = new Liquid()
    const tpl = '{%if name == "alice" %}true{%endif%}'
    const ctx = { name: Promise.resolve('alice') }
    const html = await liquid.parseAndRender(tpl, ctx)
    expect(html).toBe('true')
  })
  it('#533 Nested Promise support for scope object', async () => {
    const liquid = new Liquid()
    const context = {
      a: 1,
      b: Promise.resolve(1),
      async c () { return 1 },
      d: { d: 1 },
      e: { e: Promise.resolve(1) },
      f: {
        async f () { return 1 }
      },
      g: Promise.resolve({ g: 1 }),
      async h () {
        return { h: 1 }
      },
      i: Promise.resolve({
        i: Promise.resolve(1)
      }),
      j: Promise.resolve({
        async j () {
          return 1
        }
      })
    }

    expect(await liquid.evalValue('a == 1', context)).toBe(true)
    expect(await liquid.evalValue('b == 1', context)).toBe(true)
    expect(await liquid.evalValue('c == 1', context)).toBe(true)
    expect(await liquid.evalValue('d.d == 1', context)).toBe(true)
    expect(await liquid.evalValue('e.e == 1', context)).toBe(true)
    expect(await liquid.evalValue('f.f == 1', context)).toBe(true)
    expect(await liquid.evalValue('g.g == 1', context)).toBe(true)
    expect(await liquid.evalValue('h.h == 1', context)).toBe(true)
    expect(await liquid.evalValue('i.i == 1', context)).toBe(true)
    expect(await liquid.evalValue('j.j == 1', context)).toBe(true)
    expect(await liquid.parseAndRender('{{a}}', context)).toBe('1')
    expect(await liquid.parseAndRender('{{b}}', context)).toBe('1')
    expect(await liquid.parseAndRender('{{c}}', context)).toBe('1')
    expect(await liquid.parseAndRender('{{d.d}}', context)).toBe('1')
    expect(await liquid.parseAndRender('{{e.e}}', context)).toBe('1')
    expect(await liquid.parseAndRender('{{f.f}}', context)).toBe('1')
    expect(await liquid.parseAndRender('{{g.g}}', context)).toBe('1')
    expect(await liquid.parseAndRender('{{h.h}}', context)).toBe('1')
    expect(await liquid.parseAndRender('{{i.i}}', context)).toBe('1')
    expect(await liquid.parseAndRender('{{j.j}}', context)).toBe('1')
  })
  it('#559 Case/When should evaluate multiple When statements', async () => {
    const liquid = new Liquid()
    const tpl = `
      {% assign tag = 'Love' %}

      {% case tag %}
        {% when 'Love' or 'Luck' %}
          This is a love or luck potion.
        {% when 'Strength','Health', 'Love' %}
          This is a strength or health or love potion.
        {% else %}
          This is a potion.
      {% endcase %}
    `
    const html = await liquid.parseAndRender(tpl)
    expect(html).toMatch(/^\s*This is a love or luck potion.\s+This is a strength or health or love potion.\s*$/)
  })
  it('#570 tag registration compatible to v9', async () => {
    const liquid = new Liquid()
    liquid.registerTag('metadata_file', {
      parse (tagToken: TagToken, remainTokens: TopLevelToken[]) {
        this.str = tagToken.args
      },
      async render (ctx: Context) {
        const content = await Promise.resolve(`{{${this.str}}}`)
        return this.liquid.parseAndRender(content.toString(), ctx)
      }
    })
    const tpl = '{% metadata_file foo %}'
    const ctx = { foo: 'FOO' }
    const html = await liquid.parseAndRender(tpl, ctx)
    expect(html).toBe('FOO')
  })
  it('#573 date filter should return parsed input when no format is provided', async () => {
    const liquid = new Liquid()
    liquid.registerTag('metadata_file', {
      parse (tagToken: TagToken, remainTokens: TopLevelToken[]) {
        this.str = tagToken.args
      },
      async render (ctx: Context) {
        const content = await Promise.resolve(`{{${this.str}}}`)
        return this.liquid.parseAndRender(content.toString(), ctx)
      }
    })
    const tpl = `{{ 'now' | date }}`
    const html = await liquid.parseAndRender(tpl)
    // sample: Thursday, February 2, 2023 at 6:25 pm +0000
    expect(html).toMatch(/\w+, \w+ \d+, \d\d\d\d at \d+:\d\d [ap]m [-+]\d\d\d\d/)
  })
  it('#575 Add support for Not operator', async () => {
    const liquid = new Liquid()
    const tpl = `
    {% if link and not button %}
      <a href="{{ link }}">Lot more code here</a>
    {% else %}
      <div>Lot more code here</div>
    {% endif %}`
    const ctx = { link: 'https://example.com', button: false }
    const html = await liquid.parseAndRender(tpl, ctx)
    expect(html.trim()).toBe('<a href="https://example.com">Lot more code here</a>')
  })
  it('#70 strip multiline content of <style>', async () => {
    const str = `
    <style type="text/css">
      .test-one-line {display: none;}
    </style>`
    const engine = new Liquid()
    const template = '{{ str | strip_html }}'
    const html = await engine.parseAndRender(template, { str })
    expect(html).toMatch(/^\s*$/)
  })
  it('#589 Arrays should compare values', async () => {
    const engine = new Liquid()
    const template = `
    {% assign people1 = "alice, bob, carol" | split: ", " -%}
    {% assign people2 = "alice, bob, carol" | split: ", " -%}
    {% if people1 == people2 %}true{%else%}false{% endif %}
    `
    const html = await engine.parseAndRender(template)
    expect(html).toContain('true')
  })
  it('#604 date filter appears to add DST correction to UTC dates', () => {
    const engine = new Liquid({
      timezoneOffset: 'Etc/GMT'
    })

    const html = engine.parseAndRenderSync(
      '{{ "2023-04-05T12:00:00Z" | date: "%Y-%m-%dT%H:%M:%S%z", "Etc/GMT" }}' +
      '{{ "2023-01-05T12:00:00Z" | date: "%Y-%m-%dT%H:%M:%S%z", 0 }}' +
      '{{ "2023-01-05T12:00:00Z" | date: "%Y-%m-%dT%H:%M:%S%z", "Etc/GMT" }}' +
      '{{ "2023-01-05T12:00:00Z" | date: "%Y-%m-%dT%H:%M:%S%z" }}' +
      '{{ "2023-01-05T12:00:00+0000" | date: "%Y-%m-%dT%H:%M:%S%z", 0 }}'
    )
    const expected =
      '2023-04-05T12:00:00+0000' +
      '2023-01-05T12:00:00+0000' +
      '2023-01-05T12:00:00+0000' +
      '2023-01-05T12:00:00+0000' +
      '2023-01-05T12:00:00+0000'
    expect(html).toEqual(expected)
  })
  it('#610 should throw missing ":" after filter name', () => {
    const engine = new Liquid()
    const fn = () => engine.parseAndRenderSync("{%- assign module = '' | split '' -%}")
    expect(fn).toThrow(/expected ":" after filter name/)
  })
  it('#628 Single or double quote breaks comments', () => {
    const template = `{%- liquid
  # Show a message that's customized to the product type

  assign product_type = product.type | downcase
  assign message = ''

  case product_type
    when 'health'
      assign message = 'This is a health potion!'
    when 'love'
      assign message = 'This is a love potion!'
    else
      assign message = 'This is a potion!'
  endcase

  echo message
-%}`
    const engine = new Liquid()
    const product = { type: 'love' }
    const result = engine.parseAndRenderSync(template, { product })
    expect(result).toEqual('This is a love potion!')
  })
  it('#643 Error When Accessing Subproperty of Bracketed Reference', () => {
    const engine = new Liquid()
    const tpl = '{{ ["Key String with Spaces"].subpropertyKey }}'
    const ctx = {
      'Key String with Spaces': {
        subpropertyKey: 'FOO'
      }
    }
    expect(engine.parseAndRenderSync(tpl, ctx)).toEqual('FOO')
  })
  it('#655 Error in the tokenization process due to an invalid value expression', () => {
    const engine = new Liquid()
    const result = engine.parseAndRenderSync('{{ÜLKE}}', { ÜLKE: 'Türkiye' })
    expect(result).toEqual('Türkiye')
  })
})
