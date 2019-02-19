import TagToken from 'src/parser/tag-token';
import Token from 'src/parser/token';
import Scope from 'src/scope/scope';
declare const _default: {
    parse: (tagToken: TagToken, remainTokens: Token[]) => void;
    render: (scope: Scope) => Promise<void>;
};
export default _default;
