import { stringify } from '../util/underscore'

export const url_decode = (x: string) => stringify(x).split('+').map(decodeURIComponent).join(' ')
export const url_encode = (x: string) => stringify(x).split(' ').map(encodeURIComponent).join('+')
