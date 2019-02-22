import DelimitedToken from './delimited-token';
export default class TagToken extends DelimitedToken {
    name: string;
    args: string;
    constructor(raw: string, value: string, input: string, line: number, pos: number, file?: string);
}
