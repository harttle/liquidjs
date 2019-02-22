import Token from 'src/parser/token';
import ITemplate from 'src/template/itemplate';
declare abstract class LiquidError extends Error {
    private token;
    private originalError;
    constructor(err: Error, token: Token);
    protected update(): void;
}
export declare class TokenizationError extends LiquidError {
    constructor(message: string, token: Token);
}
export declare class ParseError extends LiquidError {
    constructor(err: Error, token: Token);
}
export declare class RenderError extends LiquidError {
    constructor(err: Error, tpl: ITemplate);
}
export declare class RenderBreakError extends Error {
    resolvedHTML: string;
    constructor(message: string);
}
export declare class AssertionError extends Error {
    constructor(message: string);
}
export {};
