import Liquid from 'liquidjs'

const engine = new Liquid({
  root: __dirname,
  extname: '.liquid'
})

engine.registerTag('header', {
  parse: function (token) {
    const [key, val] = token.args.split(':')
    this[key] = val
  },
  render: function (scope, hash) {
    const title = this.liquid.evalValue(this['content'], scope)
    return `<h1>${title}</h1>`
  }
})

const ctx = {
  todos: ['fork and clone', 'make it better', 'make a pull request'],
  title: 'Welcome to liquidjs!'
}

// console.log('isTruthy:', isTruthy('a string here'));
engine.renderFile('todolist', ctx).then(console.log)
