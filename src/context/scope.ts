import { Drop } from '../drop/drop'
import { hasOwnProperty } from '../util'

export interface ScopeObject extends Record<string | number | symbol, any> {
  toLiquid?: () => any;
}

export type Scope = ScopeObject | Drop

const BLOCKED_SCOPE_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

export function isBlockedScopeKey (key: PropertyKey): boolean {
  return typeof key === 'string' && BLOCKED_SCOPE_KEYS.has(key)
}

export function shouldBlockScopeKeyRead (obj: Scope, key: PropertyKey, ownPropertyOnly: boolean): boolean {
  if (!isBlockedScopeKey(key)) return false
  if (ownPropertyOnly) return true
  return !hasOwnProperty.call(obj, key)
}

export function shouldBlockScopeKeyWrite (key: PropertyKey, ownPropertyOnly: boolean): boolean {
  return ownPropertyOnly && isBlockedScopeKey(key)
}

export function createScope (from?: ScopeObject): ScopeObject {
  return Object.assign(Object.create(null), from)
}
