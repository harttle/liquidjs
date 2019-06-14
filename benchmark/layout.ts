import * as Benchmark from 'benchmark'
import Liquid from '../src/liquid'

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

export default function () {
  console.log('--- layout ---')
  return new Promise(resolve => {
    new Benchmark.Suite('layout')
      .add('cache=false', {
        defer: true,
        fn: (d: any) => engine.parseAndRender(template, {}).then(x => d.resolve(x))
      })
      .add('cache=true', {
        defer: true,
        fn: (d: any) => cachingEngine.parseAndRender(template, {}).then(x => d.resolve(x))
      })
      .on('cycle', (event: any) => console.log(String(event.target)))
      .on('complete', resolve)
      .run({ 'async': true })
  })
}
