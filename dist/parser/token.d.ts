export default class Token {
    type: string;
    line: number;
    col: number;
    raw: string;
    input: string;
    file: string;
    value: string;
    constructor(raw: any, col: any, input: any, file: any, line: any);
}
