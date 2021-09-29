import { Context } from '../context/context'
import { Token } from '../tokens/token'
import { Emitter } from '../emitters/emitter'

export interface Template {
  token: Token;
  render(ctx: Context, emitter: Emitter): any;
}
