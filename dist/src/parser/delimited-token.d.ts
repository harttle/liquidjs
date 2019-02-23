import Token from './token';
export default class DelimitedToken extends Token {
    trimLeft: boolean;
    trimRight: boolean;
    constructor(raw: string, value: string, input: string, line: number, pos: number, file?: string);
}
