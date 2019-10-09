import { output } from './output'
import { tag } from './tag'
import { demo } from './demo'
import { layout } from './layout'
import { memory } from './memory'

async function main () {
  await output()
  await tag()
  await demo()
  await layout()
  await memory()
}

main()
