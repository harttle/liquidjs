export default class Token {
    type: string;
    line: number;
    col: number;
    raw: string;
    input: string;
    file?: string;
    value: string;
    constructor(raw: string, input: string, line: number, col: number, file?: string);
}
