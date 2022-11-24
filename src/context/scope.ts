import { Drop } from '../drop/drop'

interface ScopeObject extends Record<string, any> {
  toLiquid?: () => any;
}

export type Scope = ScopeObject | Drop
