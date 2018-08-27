const express = require('express')
const Liquid = require('../..')

let app = express()
let engine = Liquid({
  root: __dirname, // for layouts and partials
  extname: '.liquid'
})

app.engine('liquid', engine.express()) // register liquid engine
app.set('views', ['./partials', './views']) // specify the views directory
app.set('view engine', 'liquid') // set to default

app.get('/', function (req, res) {
  let todos = ['fork and clone', 'make it better', 'make a pull request']
  res.render('todolist', {
    todos: todos,
    title: 'Welcome to liquidjs!'
  })
})

module.exports = app
