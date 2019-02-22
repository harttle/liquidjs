import Scope from 'src/scope/scope';
import { FilterImpl } from './filter-impl';
export default class Filter {
    name: string;
    impl: FilterImpl;
    args: string[];
    private static impls;
    constructor(str: string, strictFilters?: boolean);
    parseArgs(argList: string): string[];
    render(value: any, scope: Scope): any;
    static register(name: string, filter: FilterImpl): void;
    static clear(): void;
}
