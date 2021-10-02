#!/usr/bin/env node

const Benchmark = require('benchmark')
const data = require('./data/todolist.json')
const path = require('path')

const engines = {
  handlebars: require('./engines/handlebars'),
  liquid: require('./engines/liquid'),
  react: require('./engines/react'),
  swig: require('./engines/swig')
}

function crossEngines () {
  console.log('     cross engines')
  console.log('------------------------')
  return new Promise(resolve => {
    const suit = new Benchmark.Suite('cross engines')

    for (const [name, { load, render }] of Object.entries(engines)) {
      const tpl = load(path.resolve(__dirname, `templates/todolist`))
      suit.add(name, () => render(tpl, data))
    }

    suit.on('cycle', event => console.log(String(event.target)))
    suit.on('complete', resolve)
    suit.run({ async: true })
  })
}

module.exports = { crossEngines }
