import Filter from './filter/filter';
import Scope from 'src/scope/scope';
export default class {
    initial: any;
    filters: Array<Filter>;
    constructor(str: string, strictFilters?: boolean);
    value(scope: Scope): any;
}
