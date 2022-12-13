const Benchmark = require('benchmark')
const { Liquid } = require('..')
const ctx = require('./data/todolist.json')
const { resolve } = require('path')

const engine = new Liquid({
  root: resolve(__dirname, 'templates'),
  extname: '.liquid'
})

function demo () {
  console.log('         demo')
  console.log('------------------------')
  return new Promise(resolve => {
    new Benchmark.Suite('demo')
      .add('demo', {
        defer: true,
        fn: d => engine.renderFile('todolist', ctx).then(x => d.resolve(x))
      })
      .on('cycle', event => console.log(String(event.target)))
      .on('complete', resolve)
      .run({ 'async': true })
  })
}

module.exports = { demo }
