import { Drop } from '../drop/drop'

type PlainObject = {
  [key: string]: any
  liquid_method_missing?: (key: string) => any // eslint-disable-line
  to_liquid?: () => any // eslint-disable-line
  toLiquid?: () => any  // eslint-disable-line
}

export type Context = PlainObject | Drop