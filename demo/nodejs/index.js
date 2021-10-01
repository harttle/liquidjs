const { Liquid } = require('liquidjs')

const engine = new Liquid({
  root: __dirname,
  extname: '.liquid',
  globals: { title: 'LiquidJS Demo' }
})

engine.registerTag('header', {
  parse: function (token) {
    const [key, val] = token.args.split(':')
    this[key] = val
  },
  render: async function (scope, emitter) {
    const title = await this.liquid.evalValue(this.content, scope)
    emitter.write(`<h1>${title}</h1>`)
  }
})

const ctx = {
  todos: ['fork and clone', 'make it better', 'make a pull request']
}

async function main () {
  console.log('==========renderFile===========')
  const html = await engine.renderFile('todolist', ctx)
  console.log(html)

  console.log('===========Streamed===========')
  const tpls = await engine.parseFile('todolist')
  engine.renderToNodeStream(tpls, ctx)
    .on('data', data => process.stdout.write(data))
    .on('end', () => console.log(''))
}

main()
