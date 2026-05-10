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

// <script>, <style>, and <!--...--> are raw-text blocks (HTML5): their content is
// opaque until the matching closer, so a `>` inside CSS/JS/comment does not end them.
// Same set as Shopify Liquid's STRIP_HTML_BLOCKS. Everything else is a generic <...>.
// We scan with indexOf and cache the next known closer per kind, keeping total work
// O(n); a regex equivalent is O(n^2) in V8 (no atomic groups / memoization).
export function strip_html (this: FilterImpl, v: string) {
  const str = stringify(v)
  this.context.memoryLimit.use(str.length)
  const blocks: [string, string][] = [['<script', '</script>'], ['<style', '</style>'], ['<!--', '-->']]
  const closes = [0, 0, 0]
  let out = ''
  let i = 0
  while (i < str.length) {
    const lt = str.indexOf('<', i)
    if (lt < 0) return out + str.slice(i)
    out += str.slice(i, lt)
    let end = -1
    for (let k = 0; k < blocks.length; k++) {
      const [opener, closer] = blocks[k]
      if (!str.startsWith(opener, lt)) continue
      const from = lt + opener.length
      if (closes[k] >= 0 && closes[k] < from) closes[k] = str.indexOf(closer, from)
      if (closes[k] >= 0) end = closes[k] + closer.length
      break
    }
    if (end < 0) end = str.indexOf('>', lt + 1) + 1
    if (end <= 0) return out + str.slice(lt)
    i = end
  }
  return out
}
