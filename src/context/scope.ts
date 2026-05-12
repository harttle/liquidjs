import { Drop } from '../drop/drop'

interface ScopeObject extends Record<string | number | symbol, any> {
  toLiquid?: () => any;
}

export type Scope = ScopeObject | Drop

/**
 * Plain scope bag with a null prototype so lookups like `__proto__` are not the
 * Object.prototype accessor unless explicitly assigned as an own property.
 */
export function createScope (props?: Record<PropertyKey, any>): ScopeObject {
  return props == null
    ? Object.create(null)
    : Object.assign(Object.create(null), props)
}
