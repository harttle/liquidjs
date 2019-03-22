import { Drop } from '../drop/drop'

type PlainObject = {
  [key: string]: any
  toLiquid?: () => any
}

export type Scope = PlainObject | Drop
