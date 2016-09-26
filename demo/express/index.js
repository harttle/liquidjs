var express = require('express');
var app = express();
var Liquid = require('..');

var engine = Liquid({
    root: __dirname,  // for layouts and partials
    extname: '.liquid'
});

app.engine('liquid', engine.express()); // register liquid engine
app.set('views', __dirname);            // specify the views directory
app.set('view engine', 'liquid');       // set to default

app.get('/', function (req, res) {
    res.render('foo');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
