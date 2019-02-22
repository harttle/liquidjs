import { isTruthy } from 'src/render/syntax'

export default {
  'default': <T1, T2>(v: T1, arg: T2): T1 | T2 => isTruthy(v) ? v : arg
}
