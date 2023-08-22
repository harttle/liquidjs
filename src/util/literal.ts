import { BlankDrop, EmptyDrop, NullDrop } from '../drop'

const nil = new NullDrop()
export const literalValues = {
  'true': true,
  'false': false,
  'nil': nil,
  'null': nil,
  'empty': new EmptyDrop(),
  'blank': new BlankDrop()
}

export type LiteralKey = keyof typeof literalValues
export type LiteralValue = typeof literalValues[LiteralKey]
