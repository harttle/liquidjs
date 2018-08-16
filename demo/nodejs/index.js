const Liquid = require('../..')

let engine = new Liquid({
  root: __dirname,
  extname: '.liquid'
})
let ctx = {
  todos: ['fork and clone', 'make it better', 'make a pull request'],
  title: 'Welcome to liquidjs!'
}

engine.renderFile('todolist', ctx).then(console.log)
