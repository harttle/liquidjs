const Liquid = require('../..')

let engine = new Liquid()
let src = 'Welcome to {{ name | capitalize}}, access time: {{date|date: "%H:%M:%S"}}'
let ctx = {
  name: 'Liquid',
  date: new Date()
}

engine.parseAndRender(src, ctx).then(console.log)
