import { isTruthy } from 'src/render/syntax'

export default {
  'default': (v, arg) => isTruthy(v) ? v : arg
}
