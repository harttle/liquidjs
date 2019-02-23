import Filter from './filter/filter';
import Scope from 'src/scope/scope';
export default class {
    initial: any;
    filters: Array<Filter>;
    /**
     * @param str value string, like: "i have a dream | truncate: 3
     */
    constructor(str: string, strictFilters: boolean);
    value(scope: Scope): any;
}
