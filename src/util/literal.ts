import { NullDrop } from '../drop/null-drop'
import { EmptyDrop } from '../drop/empty-drop'
import { BlankDrop } from '../drop/blank-drop'

const nil = new NullDrop()
export const literalValues = {
  'true': true,
  'false': false,
  'nil': nil,
  'null': nil,
  'empty': new EmptyDrop(),
  'blank': new BlankDrop()
}
