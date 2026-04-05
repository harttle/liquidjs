const Benchmark = require('benchmark')
const { Liquid } = require('..')

const engineOptions = {
  root: __dirname,
  extname: '.liquid'
}

const engine = new Liquid(engineOptions)
const cachingEngine = new Liquid({
  ...engineOptions,
  cache: true
})

const template = `
{% layout "./templates/layout.liquid" %}
{% block body %}a small body{% endblock %}
`

function layout () {
  console.log('         layout')
  console.log('------------------------')
  return new Promise(resolve => {
    new Benchmark.Suite('layout')
      .add('cache=false', {
        defer: true,
        fn: d => engine.parseAndRender(template, {}).then(x => d.resolve(x))
      })
      .add('cache=true', {
        defer: true,
        fn: d => cachingEngine.parseAndRender(template, {}).then(x => d.resolve(x))
      })
      .on('cycle', event => console.log(String(event.target)))
      .on('complete', resolve)
      .run({ 'async': true })
  })
}

module.exports = { layout }
