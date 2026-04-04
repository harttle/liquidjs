#!/usr/bin/env node
const { performance } = require('perf_hooks')
const path = require('path')

const FILE_LOCAL = process.argv[2]
const FILE_LATEST = process.argv[3]
console.log(`Local:  ${FILE_LOCAL}`)
console.log(`Latest: ${FILE_LATEST}`)

const { createEngine } = require('./engines/create-liquid')
const local = createEngine(require(path.resolve(__dirname, '..', FILE_LOCAL)))
const latest = createEngine(require(path.resolve(__dirname, '..', FILE_LOCAL)))
const data = require('./data/todolist.json')
const tpl = path.resolve(__dirname, `templates/todolist`)

const begin = performance.now()
const tplLocal = local.load(tpl)
const tplLatest = latest.load(tpl)
const tasks = [
  {
    cycles: 0,
    time: 0,
    fn: () => latest.render(tplLatest, data)
  },
  {
    cycles: 0,
    time: 0,
    fn: () => local.render(tplLocal, data)
  }
]
while (performance.now() - begin < 20e3) {
  const task = tasks[Math.floor(Math.random() * 2)]
  task.time -= performance.now()
  task.fn()
  task.time += performance.now()
  task.cycles++
}

const [ latestResult, localResult ] = tasks.map(task => {
  task.perf = task.cycles * 1000 / task.time
  return task
})
const diff = (localResult.perf - latestResult.perf) / latestResult.perf

console.log(`Local: ${localResult.perf.toFixed(3)} ops/s (${localResult.cycles} cycles)`)
console.log(`Latest: ${latestResult.perf.toFixed(3)} ops/s (${latestResult.cycles} cycles)`)
console.log(`Diff: ${(diff * 100).toFixed(3)}%`)

const THRESHOLD_PERCENT = -3
process.exit(diff * 100 < THRESHOLD_PERCENT ? 1 : 0)
