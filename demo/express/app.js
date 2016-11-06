var express = require('express');
var app = express();
var Liquid = require('../..');

var engine = Liquid({
    root: __dirname,  // for layouts and partials
    extname: '.liquid'
});

app.engine('liquid', engine.express()); // register liquid engine
app.set('views', ['./partials', './views']);            // specify the views directory
app.set('view engine', 'liquid');       // set to default

app.get('/', function (req, res) {
    var todos = ['fork and clone', 'make it better', 'make a pull request'];
    res.render('todolist', {
        todos: todos,
        title: 'Welcome to shopify-liquid!'
    });
});

module.exports = app;
