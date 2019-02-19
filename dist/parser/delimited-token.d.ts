import Token from './token';
export default class DelimitedToken extends Token {
    trimLeft: boolean;
    trimRight: boolean;
    constructor(raw: any, pos: any, input: any, file: any, line: any);
}
