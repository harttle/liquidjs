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

function escape (str) {
  return String(str).replace(/&|<|>|"|'/g, m => escapeMap[m])
}

function unescape (str) {
  return String(str).replace(/&(amp|lt|gt|#34|#39);/g, m => unescapeMap[m])
}

export default {
  'escape': escape,
  'escape_once': str => escape(unescape(str)),
  'newline_to_br': v => v.replace(/\n/g, '<br />'),
  'strip_html': v => String(v).replace(/<script.*?<\/script>|<!--.*?-->|<style.*?<\/style>|<.*?>/g, ''),
}
