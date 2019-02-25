import Scope from '../scope/scope'
import Token from '../parser/token'

export default interface ITemplate {
  token: Token;
  render(scope: Scope): Promise<string>;
}
