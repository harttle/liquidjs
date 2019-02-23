import DelimitedToken from './delimited-token';
export default class OutputToken extends DelimitedToken {
    constructor(raw: string, value: string, input: string, line: number, pos: number, file?: string);
}
