const Benchmark = require('benchmark')
const { Liquid } = require('..')

const engine = new Liquid({
  root: __dirname,
  extname: '.liquid'
})

engine.registerTag('header', {
  parse: function (token) {
    const [key, val] = token.args.split(':')
    this[key] = val
  },
  render: function (ctx) {
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

function demo () {
  console.log('--- demo ---')
  return new Promise(resolve => {
    new Benchmark.Suite('demo')
      .add('demo', {
        defer: true,
        fn: d => engine.parseAndRender(template, ctx).then(x => d.resolve(x))
      })
      .on('cycle', event => console.log(String(event.target)))
      .on('complete', resolve)
      .run({ 'async': true })
  })
}

module.exports = { demo }
