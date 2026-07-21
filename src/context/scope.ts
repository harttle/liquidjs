import { Drop } from '../drop/drop'

export interface ScopeObject extends Record<string | number | symbol, any> {
  toLiquid?: () => any;
}

export type Scope = ScopeObject | Drop

export function createScope (from?: ScopeObject): ScopeObject {
  return Object.assign(Object.create(null), from)
}
