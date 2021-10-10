import { Drop } from '../drop/drop'

export interface PlainObject {
  [key: string]: any;
  toLiquid?: () => any;
}

export type Scope = (PlainObject | Drop) & {
  /** Whether this is a page-level scope (e.g., corresponding to include/render/layout).
   * Transient scopes (like those created by a for loop) are not considered to be page-level scopes. */
  isPageLevel?: boolean;
}
