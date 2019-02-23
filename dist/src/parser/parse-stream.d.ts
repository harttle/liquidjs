import Token from 'src/parser/token';
import ITemplate from 'src/template/itemplate';
declare type ParseToken = ((token: Token, remainTokens: Array<Token>) => ITemplate);
export default class ParseStream {
    private tokens;
    private handlers;
    private stopRequested;
    private parseToken;
    constructor(tokens: Array<Token>, parseToken: ParseToken);
    on<T extends ITemplate | Token | undefined>(name: string, cb: (arg: T) => void): ParseStream;
    trigger<T extends Token | ITemplate>(event: string, arg?: T): boolean;
    start(): this;
    stop(): this;
}
export {};
