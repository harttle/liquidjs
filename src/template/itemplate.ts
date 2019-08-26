import { Context } from '../context/context'
import { Token } from '../parser/token'
import { Emitter } from '../render/emitter'

export interface ITemplate {
  token: Token;
  render(ctx: Context, emitter: Emitter): Promise<any>;
  renderSync(ctx: Context, emitter: Emitter): any;
}
