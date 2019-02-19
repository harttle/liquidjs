declare function parse(tagToken: any, remainTokens: any): void;
declare function render(scope: any, hash: any): Promise<any>;
declare const _default: {
    parse: typeof parse;
    render: typeof render;
};
export default _default;
