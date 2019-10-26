import { Context } from '../../context/context'
import { TagToken } from '../../parser/tag-token'
import { Token } from '../../parser/token'
import { ITagImpl } from './itag-impl'
import { Hash } from '../../template/tag/hash'
import { Emitter } from '../../render/emitter'

export interface ITagImplOptions {
  parse?: (this: ITagImpl, token: TagToken, remainingTokens: Token[]) => void;
  render: (this: ITagImpl, ctx: Context, hash: Hash, emitter: Emitter) => any;
}
