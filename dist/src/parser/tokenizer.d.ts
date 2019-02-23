import Token from './token';
import { NormalizedFullOptions } from '../liquid-options';
export default class Tokenizer {
    options: NormalizedFullOptions;
    constructor(options?: NormalizedFullOptions);
    tokenize(input: string, file?: string): Token[];
}
