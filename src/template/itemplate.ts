import Context from '../context/context'
import Token from '../parser/token'
import { Emitter } from '../render/emitter'

export default interface ITemplate {
  token: Token;
  render(ctx: Context, emitter: Emitter): Promise<string>;
}
