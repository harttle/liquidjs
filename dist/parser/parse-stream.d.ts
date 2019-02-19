import Token from 'src/parser/token';
import ITemplate from 'src/template/itemplate';
declare type parseToken = (token: Token, remainTokens: Array<Token>) => ITemplate;
declare type eventHandler = ((arg?: Token | ITemplate) => void);
export default class ParseStream {
    private tokens;
    private handlers;
    private stopRequested;
    private parseToken;
    constructor(tokens: Array<Token>, parseToken: parseToken);
    on(name: string, cb: eventHandler): this;
    trigger(event: string, arg?: Token | ITemplate): boolean;
    start(): this;
    stop(): this;
}
export {};
