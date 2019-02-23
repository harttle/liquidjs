import Scope from 'src/scope/scope';
import Token from 'src/parser/token';
export default interface ITemplate {
    token: Token;
    render(scope: Scope): Promise<string>;
}
