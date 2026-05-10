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

// Linear-time replacement for the previous backtracking regex
//   /<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[\s\S]*?>|<!--[\s\S]*?-->/g
// which is O(n^2) in V8 on inputs with many unclosed openers. JS regex has no atomic
// groups / possessive quantifiers, so unrolled-loop patterns don't help asymptotically.
// We scan forward with indexOf and cache the next known closer per kind so unclosed
// openers don't re-scan the tail. Each character is visited O(1) times.
const STRIP_BLOCKS = [['<script', '</script>'], ['<style', '</style>']] as const

export function strip_html (this: FilterImpl, v: string) {
  const str = stringify(v)
  this.context.memoryLimit.use(str.length)
  const closers = [0, 0]
  let out = ''
  let i = 0
  while (i < str.length) {
    const lt = str.indexOf('<', i)
    if (lt < 0) return out + str.slice(i)
    out += str.slice(i, lt)
    let end = -1
    for (let k = 0; k < STRIP_BLOCKS.length; k++) {
      const [opener, closer] = STRIP_BLOCKS[k]
      if (!str.startsWith(opener, lt)) continue
      const from = lt + opener.length
      if (closers[k] !== -1 && closers[k] < from) closers[k] = str.indexOf(closer, from)
      if (closers[k] >= 0) end = closers[k] + closer.length
      break
    }
    if (end < 0) end = str.indexOf('>', lt + 1) + 1
    if (end <= 0) return out + str.slice(lt)
    i = end
  }
  return out
}
