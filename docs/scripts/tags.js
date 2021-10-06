/* global hexo */

'use strict'

hexo.extend.tag.register('note', (args, text) => {
  const className = args.shift()
  let header = ''
  let result = ''

  if (args.length) {
    header += `<strong class="note-title">${args.join(' ')}</strong>`
  }

  result += `<blockquote class="note ${className}">${header}`
  result += hexo.render.renderSync({ text, engine: 'markdown' })
  result += '</blockquote>'

  return result
}, true)

hexo.extend.tag.register('since', (args, text) => {
  return `<p class="since">${text.trim()}</p>`
}, true)
