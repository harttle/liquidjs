const Benchmark = require('benchmark')
const { Liquid } = require('..')

const liquid = new Liquid()

function output () {
  console.log('         output')
  console.log('------------------------')
  return new Promise(resolve => {
    new Benchmark.Suite('output')
      .add('literal', test('{{false}}{{"foo"}}{{32.322}}'))
      .add('truncate', test('{{"foobar" | truncate: 3}}'))
      .add('date', test('{{"now" | date: "%d%Y%m"}}'))
      .add('escape', test('{{"1<2" | escape}}'))
      .add('default', test('{{"" | default: 3}}'))
      .on('cycle', (event) => console.log(String(event.target)))
      .on('complete', resolve)
      .run({ 'async': true })
  })
}

function test (str) {
  return {
    defer: true,
    fn: d => liquid.parseAndRender(str).then(x => d.resolve(x))
  }
}

module.exports = { output }
