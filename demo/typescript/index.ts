import { Liquid, TagToken, Hash, Context } from 'liquidjs'

const engine = new Liquid({
  root: __dirname,
  extname: '.liquid'
})

engine.registerTag('header', {
  parse: function (token: TagToken) {
    const [key, val] = token.args.split(':')
    this[key] = val
  },
  render: function (context: Context, hash: Hash) {
    const title = this.liquid.evalValue(this['content'], context)
    return `<h1>${title}</h1>`
  }
})

const ctx = {
  todos: ['fork and clone', 'make it better', 'make a pull request'],
  title: 'Welcome to liquidjs!'
}

// console.log('isTruthy:', isTruthy('a string here'));
engine.renderFile('todolist', ctx).then(console.log)
