import DelimitedToken from './delimited-token';
export default class TagToken extends DelimitedToken {
    name: string;
    args: string;
    constructor(raw: any, pos: any, input: any, file: any, line: any);
}
