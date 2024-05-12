import { stringify } from '../util/underscore'

export const url_decode = (x: string) => decodeURIComponent(stringify(x)).replace(/\+/g, ' ')
export const url_encode = (x: string) => encodeURIComponent(stringify(x)).replace(/%20/g, '+')
export const cgi_escape = (x: string) => encodeURIComponent(stringify(x))
  .replace(/%20/g, '+')
  .replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())
export const uri_escape = (x: string) => encodeURI(stringify(x))
  .replace(/%5B/g, '[')
  .replace(/%5D/g, ']')
