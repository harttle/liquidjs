import { NormalizedFullOptions } from '../liquid-options';
import BlockMode from './block-mode';
export default class Scope {
    opts: NormalizedFullOptions;
    contexts: Array<object>;
    blocks: object;
    blockMode: BlockMode;
    constructor(ctx?: object, opts?: NormalizedFullOptions);
    getAll(): object;
    get(path: string): any;
    set(path: string, v: any): void;
    unshift(ctx: object): number;
    push(ctx: object): number;
    pop(ctx?: object): object;
    findContextFor(key: string, filter?: ((conttext: object) => boolean)): object;
    readProperty(obj: any, key: any): any;
    propertyAccessSeq(str: any): any[];
}
