import { LiquidOptions } from 'src/liquid-options';
export default class Tokenizer {
    options: LiquidOptions;
    constructor(options?: LiquidOptions);
    tokenize(input: string, file?: string): any[];
}
