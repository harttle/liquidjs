import Context from '../../context/context'
import TagToken from '../../parser/tag-token'
import Token from '../../parser/token'
import Hash from '../../template/tag/hash'
import ITagImpl from './itag-impl'

export default interface ITagImplOptions {
  parse?: (this: ITagImpl, token: TagToken, remainingTokens: Array<Token>) => void
  render?: (this: ITagImpl, ctx: Context, hash: Hash) => any | Promise<any>
}
