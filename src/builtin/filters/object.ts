import { isFalsy } from '../../render/boolean'
import { toValue } from '../../util/underscore'

export default {
  'default': function<T1, T2> (v: string | T1, arg: T2): string | T1 | T2 {
    return isFalsy(toValue(v)) || v === '' ? arg : v
  },
  'json': function (v: any) {
    return JSON.stringify(v)
  }
}
