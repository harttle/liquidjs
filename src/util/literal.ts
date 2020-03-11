import { NullDrop } from '../drop/null-drop'
import { EmptyDrop } from '../drop/empty-drop'
import { BlankDrop } from '../drop/blank-drop'

export const literalValues = {
  'true': true,
  'false': false,
  'nil': new NullDrop(),
  'null': new NullDrop(),
  'empty': new EmptyDrop(),
  'blank': new BlankDrop()
}
