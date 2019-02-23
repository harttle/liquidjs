import * as Benchmark from 'benchmark'
import Liquid from '../src/liquid'

const liquid = new Liquid()

export default function () {
  console.log('--- output ---')
  return new Promise(resolve => {
    new Benchmark.Suite('output')
      .add('literal', test('{{false}}{{"foo"}}{{32.322}}'))
      .add('truncate', test('{{"foobar" | truncate: 3}}'))
      .add('date', test('{{"now" | date: "%d%Y%m"}}'))
      .add('escape', test('{{"1<2" | escape}}'))
      .add('default', test('{{"" | default: 3}}'))
      .on('cycle', (event: any) => console.log(String(event.target)))
      .on('complete', resolve)
      .run({ 'async': true })
  })
}

function test (str: string) {
  return {
    defer: true,
    fn: (d: any) => liquid.parseAndRender(str).then(x => d.resolve(x))
  }
}
