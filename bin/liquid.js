#!/usr/bin/env node

const Liquid = require('..').Liquid
const contextArg = process.argv.slice(2)[0]
let context = {}

if (contextArg) {
  if (contextArg.endsWith('.json')) {
    const fs = require('fs')
    context = JSON.parse(fs.readFileSync(contextArg, 'utf8'))
  } else {
    context = JSON.parse(contextArg)
  }
}

let tpl = ''
process.stdin.on('data', chunk => (tpl += chunk))
process.stdin.on('end', () => render(tpl))

async function render (tpl) {
  const liquid = new Liquid()
  const html = await liquid.parseAndRender(tpl, context)
  process.stdout.write(html)
}
