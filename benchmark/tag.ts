import * as Benchmark from 'benchmark'
import Liquid from '../src/liquid'

const liquid = new Liquid()

export default function () {
  console.log('--- tag ---')
  return new Promise(resolve => {
    new Benchmark.Suite('tag')
      .add('if', test('{% if "foobar" %}foo{% endif %}'))
      .add('unless', test('{%unless "foo"%}true{%else%}false{%endunless%}'))
      .add('for', test('{% for i in (1..3) %}{{fooloop.index}}{% endfor %}'))
      .add('switch', test('{%case 3%}{% when 1 %}1{% when 2 %}2{% when 3 %}3{%endcase%}'))
      .add('assign', test('{%assign a="foo bar"%}'))
      .add('capture', test('{%capture foo%}what is this{%endcapture%}'))
      .add('increment', test('{%increment a%}'))
      .add('decrement', test('{%decrement a%}'))
      .add('tablerow', test('{%tablerow i in (1..10) cols:3%}{%endtablerow%}'))
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
