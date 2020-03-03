import { Context } from '../../context/context'
import { TagToken } from '../../parser/tag-token'
import { Token } from '../../parser/token'
import { TagImpl } from './tag-impl'
import { Hash } from '../../template/tag/hash'
import { Emitter } from '../../render/emitter'

export interface TagImplOptions {
  parse?: (this: TagImpl, token: TagToken, remainingTokens: Token[]) => void;
  render: (this: TagImpl, ctx: Context, emitter: Emitter, hash: Hash) => any;
}
