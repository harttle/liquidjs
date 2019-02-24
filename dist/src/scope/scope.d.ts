import { NormalizedFullOptions } from '../liquid-options';
import BlockMode from './block-mode';
export declare type Context = {
    [key: string]: any;
    liquid_method_missing?: (key: string) => any;
    to_liquid?: () => any;
    toLiquid?: () => any;
};
export default class Scope {
    opts: NormalizedFullOptions;
    contexts: Array<Context>;
    blocks: object;
    groups: {
        [key: string]: number;
    };
    blockMode: BlockMode;
    constructor(ctx?: object, opts?: NormalizedFullOptions);
    getAll(): Context;
    get(path: string): any;
    set(path: string, v: any): void;
    unshift(ctx: object): number;
    push(ctx: object): number;
    pop(ctx?: object): object | undefined;
    findContextFor(key: string, filter?: ((conttext: object) => boolean)): Context | null;
    private readProperty;
    propertyAccessSeq(str: string): string[];
}
