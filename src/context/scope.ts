import { Drop } from '../drop/drop'

interface PlainObject {
  [key: string]: any;
  toLiquid?: () => any;
}

export type Scope = PlainObject | Drop
