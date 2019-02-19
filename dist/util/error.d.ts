declare abstract class LiquidError {
    name: string;
    message: string;
    stack: string;
    private line;
    private file;
    private input;
    private token;
    private originalError;
    constructor(err: any, token: any);
    captureStackTrace(obj: any): void;
}
export declare class TokenizationError extends LiquidError {
    constructor(message: any, token: any);
}
export declare class ParseError extends LiquidError {
    constructor(err: any, token: any);
}
export declare class RenderError extends LiquidError {
    constructor(err: any, tpl: any);
}
export declare class RenderBreakError {
    message: string;
    resolvedHTML: string;
    constructor(message: any);
}
export declare class AssertionError {
    message: string;
    constructor(message: any);
}
export {};
