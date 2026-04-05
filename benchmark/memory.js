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
  console.log('         memory')
  console.log('------------------------')
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
  const diff1 = (getHeapStatistics().used_heap_size - base) / SAMPLE_COUNT
  console.log(`[lorem-html ${h(str.length)}][before GC] ${h(diff1)}/tpl (${SAMPLE_COUNT} runs sampled)`)

  global.gc()
  const diff2 = (getHeapStatistics().used_heap_size - base) / SAMPLE_COUNT
  console.log(`[lorem-html ${h(str.length)}][after GC] ${h(diff2)}/tpl (${SAMPLE_COUNT} runs sampled)`)
}

function todolist () {
  const str = readFileSync(join(__dirname, 'templates/todolist.liquid'), 'utf8')

  global.gc()
  const base = getHeapStatistics().used_heap_size
  const templates = []

  for (let i = 0; i < SAMPLE_COUNT; i++) {
    templates.push(engine.parse(str))
  }
  const diff1 = (getHeapStatistics().used_heap_size - base) / SAMPLE_COUNT
  console.log(`[todolist ${h(str.length)}][before GC] ${h(diff1)}/tpl (${SAMPLE_COUNT} runs sampled)`)

  global.gc()
  const diff2 = (getHeapStatistics().used_heap_size - base) / SAMPLE_COUNT
  console.log(`[todolist ${h(str.length)}][after GC] ${h(diff2)}/tpl (${SAMPLE_COUNT} runs sampled)`)
}

function h (size) {
  return (size / 1024).toFixed(3) + ' KB'
}

module.exports = { memory }
