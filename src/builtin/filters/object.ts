import { isFalsy } from '../../render/syntax'

export default {
  'default': <T1, T2>(v: string | T1, arg: T2): string | T1 | T2 => isFalsy(v) || v === '' ? arg : v
}
