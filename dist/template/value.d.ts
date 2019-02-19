import Scope from 'src/scope/scope';
export default class {
    initial: any;
    filters: Array<any>;
    constructor(str: string, strictFilters?: boolean);
    value(scope: Scope): any;
}
