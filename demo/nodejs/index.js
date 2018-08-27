// const Liquid = require('../..')
const Liquid = require('../../dist/liquid.common.js')

const engine = new Liquid({
  root: __dirname,
  extname: '.liquid'
})
const ctx = {
  todos: ['fork and clone', 'make it better', 'make a pull request'],
  title: 'Welcome to liquidjs!'
}

engine.renderFile('todolist', ctx).then(console.log)
