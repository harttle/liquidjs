const express = require('express')
const { Liquid } = require('liquidjs')

const app = express()
const engine = new Liquid({
  root: __dirname, // for layouts and partials
  extname: '.liquid'
})

app.engine('liquid', engine.express()) // register liquid engine
app.set('views', ['./partials', './views']) // specify the views directory
app.set('view engine', 'liquid') // set to default

app.get('/', function (req, res) {
  const todos = ['fork and clone', 'make it better', 'make a pull request']
  res.render('todolist', {
    todos: todos,
    title: 'Welcome to liquidjs!'
  })
})

module.exports = app
