const { output } = require('./output')
const { tag } = require('./tag')
const { demo } = require('./demo')
const { layout } = require('./layout')
const { memory } = require('./memory')

async function main () {
  // await output()
  // await tag()
  // await demo()
  // await layout()
  await memory()
}

main()
