import * as Benchmark from 'benchmark'
import { Context, TagToken, Liquid } from '../src/liquid'

const engine = new Liquid({
  root: __dirname,
  extname: '.liquid'
})

engine.registerTag('header', {
  parse: function (token: TagToken) {
    const [key, val] = token.args.split(':')
    this[key] = val
  },
  render: function (ctx: Context) {
    const title = this.liquid.evalValue(this.content, ctx)
    return `<h1>${title}</h1>`
  }
})

const ctx = {
  todos: ['fork and clone', 'make it better', 'make a pull request'],
  title: 'Welcome to liquidjs!'
}

const template = `
{%header content: "welcome to liquid" | capitalize%}

<ul>
  {% for todo in todos %}
  <li>{{forloop.index}} - {{todo}}</li>
  {% endfor %}
</ul>
`

export function demo () {
  console.log('--- demo ---')
  return new Promise(resolve => {
    new Benchmark.Suite('demo')
      .add('demo', {
        defer: true,
        fn: (d: any) => engine.parseAndRender(template, ctx).then((x: any) => d.resolve(x))
      })
      .on('cycle', (event: any) => console.log(String(event.target)))
      .on('complete', resolve)
      .run({ 'async': true })
  })
}
