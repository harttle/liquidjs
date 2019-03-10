import { Drop } from '../drop/drop'

type PlainObject = {
  [key: string]: any
  toLiquid?: () => any
}

export type Context = PlainObject | Drop
