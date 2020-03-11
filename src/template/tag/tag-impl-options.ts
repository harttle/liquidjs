import { Context } from '../../context/context'
import { TagToken } from '../../tokens/tag-token'
import { TopLevelToken } from '../../tokens/toplevel-token'
import { TagImpl } from './tag-impl'
import { Hash } from '../../template/tag/hash'
import { Emitter } from '../../render/emitter'

export interface TagImplOptions {
  parse?: (this: TagImpl, token: TagToken, remainingTokens: TopLevelToken[]) => void;
  render: (this: TagImpl, ctx: Context, emitter: Emitter, hash: Hash) => any;
}
