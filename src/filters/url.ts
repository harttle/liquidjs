import { stringify } from '../util/underscore'

export const url_decode = (x: string) => decodeURIComponent(stringify(x)).replace(/\+/g, ' ')
export const url_encode = (x: string) => encodeURIComponent(stringify(x)).replace(/%20/g, '+')
export const cgi_escape = (x: string) => encodeURIComponent(stringify(x))
  .replace(/%20/g, '+')
  .replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())
export const uri_escape = (x: string) => encodeURI(stringify(x))
  .replace(/%5B/g, '[')
  .replace(/%5D/g, ']')

const rSlugifyDefault = /[^\p{M}\p{L}\p{Nd}]+/ug
const rSlugifyReplacers = {
  'raw': /\s+/g,
  'default': rSlugifyDefault,
  'pretty': /[^\p{M}\p{L}\p{Nd}._~!$&'()+,;=@]+/ug,
  'ascii': /[^A-Za-z0-9]+/g,
  'latin': rSlugifyDefault,
  'none': null
}

export function slugify (str: string, mode: keyof typeof rSlugifyReplacers = 'default', cased = false): string {
  str = stringify(str)

  const replacer = rSlugifyReplacers[mode]
  if (replacer) {
    if (mode === 'latin') str = removeAccents(str)
    str = str.replace(replacer, '-').replace(/^-|-$/g, '')
  }

  return cased ? str : str.toLowerCase()
}

function removeAccents (str: string): string {
  return str.replace(/[àáâãäå]/g, 'a')
    .replace(/[æ]/g, 'ae')
    .replace(/[ç]/g, 'c')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[ð]/g, 'd')
    .replace(/[ñ]/g, 'n')
    .replace(/[òóôõöø]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[ß]/g, 'ss')
    .replace(/[œ]/g, 'oe')
    .replace(/[þ]/g, 'th')
    .replace(/[ẞ]/g, 'SS')
    .replace(/[Œ]/g, 'OE')
    .replace(/[Þ]/g, 'TH')
}
