import Value from './value';
import Template from 'src/template/template';
import ITemplate from 'src/template/itemplate';
import Scope from 'src/scope/scope';
import OutputToken from 'src/parser/output-token';
export default class Output extends Template implements ITemplate {
    value: Value;
    constructor(token: OutputToken, strictFilters?: boolean);
    render(scope: Scope): Promise<string>;
}
