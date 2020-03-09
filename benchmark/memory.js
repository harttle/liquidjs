const { join } = require('path')
const { readFileSync } = require('fs')
const { getHeapStatistics } = require('v8')
const { Liquid } = require('..')

const engineOptions = {
  root: __dirname,
  extname: '.liquid'
}

const engine = new Liquid(engineOptions)

const SAMPLE_COUNT = 1024

function memory () {
  console.log('--- memory ---')
  html()
  todolist()
}

function html () {
  const str = readFileSync(join(__dirname, 'templates/lorem-html.liquid'), 'utf8')

  global.gc()
  const base = getHeapStatistics().used_heap_size
  const templates = []

  for (let i = 0; i < SAMPLE_COUNT; i++) {
    templates.push(engine.parse(str))
  }
  global.gc()

  const diff = (getHeapStatistics().used_heap_size - base) / SAMPLE_COUNT
  console.log(`${h(str.length)} HTML template x ${h(diff)}/instance (${SAMPLE_COUNT} instances sampled)`)
}

function todolist () {
  const str = readFileSync(join(__dirname, 'templates/todolist.liquid'), 'utf8')

  global.gc()
  const base = getHeapStatistics().used_heap_size
  const templates = []

  for (let i = 0; i < SAMPLE_COUNT; i++) {
    templates.push(engine.parse(str))
  }
  global.gc()

  const diff = (getHeapStatistics().used_heap_size - base) / SAMPLE_COUNT
  console.log(`${h(str.length)} Todo template x ${h(diff)}/instance (${SAMPLE_COUNT} instances sampled)`)
}

function h (size) {
  return (size / 1024).toFixed(3) + ' kB'
}

module.exports = { memory }
