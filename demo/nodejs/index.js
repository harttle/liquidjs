const { Liquid } = require('liquidjs')

const engine = new Liquid({
  root: __dirname,
  extname: '.liquid',
  globals: {title: 'LiquidJS Demo'}
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

engine.renderFile('todolist', ctx)
  .then(console.log)
  .catch(err => console.error(err.stack))
