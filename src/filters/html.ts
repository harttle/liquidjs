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

export function strip_html (this: FilterImpl, v: string) {
  const str = stringify(v)
  this.context.memoryLimit.use(str.length)
  // Single-pass linear strip. The previous regex
  //   /<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[\s\S]*?>|<!--[\s\S]*?-->/g
  // backtracks O(n^2) on inputs with many unclosed openers (e.g. `'<script'.repeat(N)`).
  // We use indexOf-based scanning and cache "no closer after position k" results so that
  // repeated unclosed openers do not re-scan the tail. Total work is O(n).
  let out = ''
  let i = 0
  const n = str.length
  let scriptEnd = 0
  let styleEnd = 0
  while (i < n) {
    const lt = str.indexOf('<', i)
    if (lt < 0) { out += str.slice(i); break }
    if (lt > i) out += str.slice(i, lt)
    let end = -1
    if (str.startsWith('<script', lt)) {
      if (scriptEnd !== -1 && scriptEnd < lt + 7) scriptEnd = str.indexOf('</script>', lt + 7)
      if (scriptEnd >= 0) end = scriptEnd + 9
    } else if (str.startsWith('<style', lt)) {
      if (styleEnd !== -1 && styleEnd < lt + 6) styleEnd = str.indexOf('</style>', lt + 6)
      if (styleEnd >= 0) end = styleEnd + 8
    }
    if (end < 0) {
      const gt = str.indexOf('>', lt + 1)
      if (gt < 0) { out += str.slice(lt); break }
      end = gt + 1
    }
    i = end
  }
  return out
}
