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

export function escape (str: string) {
  return stringify(str).replace(/&|<|>|"|'/g, m => escapeMap[m])
}

function unescape (str: string) {
  return stringify(str).replace(/&(amp|lt|gt|#34|#39);/g, m => unescapeMap[m])
}

export function escape_once (str: string) {
  return escape(unescape(stringify(str)))
}

export function newline_to_br (v: string) {
  return stringify(v).replace(/\n/g, '<br />\n')
}

export function strip_html (v: string) {
  return stringify(v).replace(/<script.*?<\/script>|<!--.*?-->|<style.*?<\/style>|<.*?>/g, '')
}
