import Scope from 'src/scope/scope';
import TagToken from 'src/parser/tag-token';
import Token from 'src/parser/token';
import Hash from 'src/template/tag/hash';
import ITagImpl from './itag-impl';
export default interface ITagImplOptions {
    parse?: (this: ITagImpl, token: TagToken, remainingTokens: Array<Token>) => void;
    render?: (this: ITagImpl, scope: Scope, hash: Hash) => any | Promise<any>;
}
