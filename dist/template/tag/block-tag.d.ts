import Scope from 'src/scope/scope';
import ITagImplOptions from './itag-impl-options';
import Liquid from 'src/liquid';
import Template from 'src/template/template';
import ITemplate from 'src/template/itemplate';
import TagToken from 'src/parser/tag-token';
import Token from 'src/parser/token';
export default class Tag extends Template<TagToken> implements ITemplate {
    name: string;
    private impl;
    static impls: {
        [key: string]: ITagImplOptions;
    };
    constructor(token: TagToken, tokens: Token[], liquid: Liquid);
    render(scope: Scope): Promise<string>;
    static register(name: string, tag: ITagImplOptions): void;
    static clear(): void;
}
