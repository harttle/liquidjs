import Liquid from 'src/liquid';
import ParseStream from './parse-stream';
import Token from './token';
import Tag from 'src/template/tag/tag';
import Output from 'src/template/output';
import HTML from 'src/template/html';
export default class Parser {
    liquid: Liquid;
    constructor(liquid: Liquid);
    parse(tokens: Array<Token>): any[];
    parseToken(token: Token, remainTokens: Array<Token>): Tag | Output | HTML;
    parseStream(tokens: Array<Token>): ParseStream;
}
