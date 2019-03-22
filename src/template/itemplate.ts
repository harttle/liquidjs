import Context from '../context/context'
import Token from '../parser/token'

export default interface ITemplate {
  token: Token;
  render(ctx: Context): Promise<string>;
}
