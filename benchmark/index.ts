import output from './output'
import tag from './tag'
import demo from './demo'
import layout from './layout'

async function main () {
  await output()
  await tag()
  await demo()
  await layout()
}

main()
