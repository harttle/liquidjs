import Template from 'src/template/template';
import ITemplate from 'src/template/itemplate';
import HTMLToken from 'src/parser/html-token';
export default class extends Template<HTMLToken> implements ITemplate {
    str: string;
    constructor(token: HTMLToken);
    render(): Promise<string>;
}
