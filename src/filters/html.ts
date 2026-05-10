import { FilterImpl } from '../template'
import { stringify } from '../util/underscore'

const escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&#34;',
  "'": '&#39;'
}
const unescapeMap = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&#34;': '"',
  '&#39;': "'"
}

export function escape (this: FilterImpl, str: string) {
  str = stringify(str)
  this.context.memoryLimit.use(str.length)
  return str.replace(/&|<|>|"|'/g, m => escapeMap[m])
}

export function xml_escape (this: FilterImpl, str: string) {
  return escape.call(this, str)
}

function unescape (this: FilterImpl, str: string) {
  str = stringify(str)
  this.context.memoryLimit.use(str.length)
  return str.replace(/&(amp|lt|gt|#34|#39);/g, m => unescapeMap[m])
}

export function escape_once (this: FilterImpl, str: string) {
  return escape.call(this, unescape.call(this, str))
}

export function newline_to_br (this: FilterImpl, v: string) {
  const str = stringify(v)
  this.context.memoryLimit.use(str.length)
  return str.replace(/\r?\n/gm, '<br />\n')
}

// Linear-time strip via indexOf scan. A regex equivalent to the old
//   /<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[\s\S]*?>|<!--[\s\S]*?-->/g
// is O(n^2) on unclosed openers (JS regex has no atomic groups / memoization),
// so we cache "next known </script>/</style> position" across openers.
export function strip_html (this: FilterImpl, v: string) {
  const str = stringify(v)
  this.context.memoryLimit.use(str.length)
  let out = ''
  let i = 0
  let scriptEnd = 0
  let styleEnd = 0
  while (i < str.length) {
    const lt = str.indexOf('<', i)
    if (lt < 0) return out + str.slice(i)
    out += str.slice(i, lt)
    let end = -1
    if (str.startsWith('<script', lt)) {
      if (scriptEnd >= 0 && scriptEnd < lt + 7) scriptEnd = str.indexOf('</script>', lt + 7)
      if (scriptEnd >= 0) end = scriptEnd + 9
    } else if (str.startsWith('<style', lt)) {
      if (styleEnd >= 0 && styleEnd < lt + 6) styleEnd = str.indexOf('</style>', lt + 6)
      if (styleEnd >= 0) end = styleEnd + 8
    }
    if (end < 0) end = str.indexOf('>', lt + 1) + 1
    if (end <= 0) return out + str.slice(lt)
    i = end
  }
  return out
}
