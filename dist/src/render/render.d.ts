import Scope from 'src/scope/scope';
import ITemplate from 'src/template/itemplate';
export default class Render {
    renderTemplates(templates: ITemplate[], scope: Scope): Promise<string>;
}
