import { Drop } from '../drop/drop'

export interface PlainObject {
  [key: string]: any;
  toLiquid?: () => any;
}

export type Scope = PlainObject | Drop
