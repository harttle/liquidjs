import Scope from 'src/scope/scope';
declare type impl = (value: any, ...args: any[]) => any;
export default class Filter {
    name: string;
    impl: impl;
    args: string[];
    private static impls;
    constructor(str: string, strictFilters?: boolean);
    parseArgs(argList: string): string[];
    render(value: any, scope: Scope): any;
    static register(name: any, filter: any): void;
    static clear(): void;
}
export {};
