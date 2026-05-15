import { Drop } from '../drop/drop'

export interface ScopeObject extends Record<string | number | symbol, any> {
  toLiquid?: () => any;
}

export type Scope = ScopeObject | Drop

export function createScope (from?: ScopeObject): ScopeObject {
  const scope = Object.create(null)
  if (from) Object.assign(scope, from)
  return scope
}
