import { NormalizedFullOptions } from '../liquid-options';
import BlockMode from './block-mode';
import IContext from './icontext';
export default class Scope {
    opts: NormalizedFullOptions;
    contexts: Array<IContext>;
    blocks: object;
    groups: {
        [key: string]: number;
    };
    blockMode: BlockMode;
    constructor(ctx?: object, opts?: NormalizedFullOptions);
    getAll(): IContext;
    get(path: string): any;
    set(path: string, v: any): void;
    unshift(ctx: object): number;
    push(ctx: object): number;
    pop(ctx?: object): object | undefined;
    findContextFor(key: string, filter?: ((conttext: object) => boolean)): IContext | null;
    private readProperty;
    propertyAccessSeq(str: string): string[];
}
