#!/usr/bin/env node

// In Hexo, content inside markdown code/code fences,
// will not go through nunjucks.
// So we're escaping special chars outside code only.
let backTick = 0
process.stdin.on('data', (buffer) => {
  for (const c of buffer.toString()) {
    if (c === '`') {
      backTick++
    }
    const shouldEscape = '{%%}'.includes(c) && backTick % 2 === 0
    if (shouldEscape) {
      const code = c.charCodeAt(0).toString(16)
      process.stdout.write(`&#x${code};`)
    } else process.stdout.write(c)
  }
})
