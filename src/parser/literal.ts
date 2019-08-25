import { last } from '../util/underscore'
import { NullDrop } from '../drop/null-drop'
import { EmptyDrop } from '../drop/empty-drop'
import { BlankDrop } from '../drop/blank-drop'

type literal = true | false | NullDrop | EmptyDrop | BlankDrop | number | string

export function parseLiteral (str: string): literal | undefined {
  str = str.trim()

  if (str === 'true') return true
  if (str === 'false') return false
  if (str === 'nil' || str === 'null') return new NullDrop()
  if (str === 'empty') return new EmptyDrop()
  if (str === 'blank') return new BlankDrop()
  if (!isNaN(Number(str))) return Number(str)
  if ((str[0] === '"' || str[0] === "'") && str[0] === last(str)) return str.slice(1, -1)
}
