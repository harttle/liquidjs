import { stringify } from '../../util/underscore'

export const urlDecode = (x: string) => stringify(x).split('+').map(decodeURIComponent).join(' ')
export const urlEncode = (x: string) => stringify(x).split(' ').map(encodeURIComponent).join('+')
