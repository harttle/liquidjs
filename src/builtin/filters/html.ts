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

function escape (str: string) {
  return String(str).replace(/&|<|>|"|'/g, m => escapeMap[m])
}

function unescape (str: string) {
  return String(str).replace(/&(amp|lt|gt|#34|#39);/g, m => unescapeMap[m])
}

export default {
  'escape': escape,
  'escape_once': (str: string) => escape(unescape(str)),
  'newline_to_br': (v: string) => v.replace(/\n/g, '<br />'),
  'strip_html': (v: string) => v.replace(/<script.*?<\/script>|<!--.*?-->|<style.*?<\/style>|<.*?>/g, '')
}
