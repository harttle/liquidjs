import { join } from 'path'
import { readFileSync } from 'fs'
import { getHeapStatistics } from 'v8'
import { Liquid } from '../src/liquid'

const engineOptions = {
  root: __dirname,
  extname: '.liquid'
}

const engine = new Liquid(engineOptions)

const templateString = readFileSync(join(__dirname, 'templates/lorem-html.liquid'), 'utf8')
const templateSizeKb = templateString.length / 1024

const NB_INSTANCES_TO_RETAIN = 250

export function memory () {
  console.log('--- memory ---')
  const initialUsedHeapSize = getHeapStatistics().used_heap_size
  const templates = []

  for (let i = 0; i < NB_INSTANCES_TO_RETAIN; i++) {
    templates.push(engine.parse(templateString))
  }

  const finalUsedHeapSize = getHeapStatistics().used_heap_size
  const heapDifference = finalUsedHeapSize - initialUsedHeapSize
  const avgRetainedPerTemplate = (heapDifference / NB_INSTANCES_TO_RETAIN) / 1024

  console.log(`retained memory for a ${templateSizeKb}KB template: ${avgRetainedPerTemplate}KB (${NB_INSTANCES_TO_RETAIN} samples)`)
}
