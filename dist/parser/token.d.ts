export default class Token {
    type: string;
    line: number;
    raw: string;
    input: string;
    file: string;
    value: string;
    constructor(raw: any, pos: any, input: any, file: any, line: any);
}
