import { stringify } from '../../util/underscore'

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
  return String(str).replace(/&(amp|lt|gt|#34|#39);/g, m => unescapeMap[m])
}

export function escapeOnce (str: string) {
  return escape(unescape(str))
}

export function newlineToBr (v: string) {
  return v.replace(/\n/g, '<br />\n')
}

export function stripHtml (v: string) {
  return v.replace(/<script.*?<\/script>|<!--.*?-->|<style.*?<\/style>|<.*?>/g, '')
}
