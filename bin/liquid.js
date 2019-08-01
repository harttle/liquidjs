#!/usr/bin/env node

const Liquid = require('..')

let tpl = ''
process.stdin.on('data', chunk => (tpl += chunk))
process.stdin.on('end', () => render(tpl))

async function render (tpl) {
  const liquid = new Liquid()
  const html = await liquid.parseAndRender(tpl)
  console.log(html)
}