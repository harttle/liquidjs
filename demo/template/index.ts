import { Liquid } from 'liquidjs'
import { getOutputs } from './get-outputs'

const engine = new Liquid({
  root: __dirname,
  extname: '.liquid'
})

const templates = engine.parseFileSync('todolist')

for (const output of getOutputs(templates)) {
  const token = output.token
  const [line, col] = token.getPosition()
  const text = token.getText()
  console.log(`[${line}:${col}] ${text}`)
}
