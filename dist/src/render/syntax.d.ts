import Scope from 'src/scope/scope';
export declare function parseExp(exp: string, scope: Scope): any;
export declare function evalExp(str: string, scope: Scope): any;
export declare function evalValue(str: string, scope: Scope): any;
export declare function isTruthy(val: any): boolean;
export declare function isFalsy(val: any): boolean;
