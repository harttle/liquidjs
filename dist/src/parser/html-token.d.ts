import Token from './token';
export default class HTMLToken extends Token {
    constructor(str: string, input: string, line: number, col: number, file?: string);
}
