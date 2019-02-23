import Liquid from 'src/liquid';
import ParseStream from './parse-stream';
import Token from './token';
import Tag from 'src/template/tag/tag';
import Output from 'src/template/output';
import HTML from 'src/template/html';
import ITemplate from 'src/template/itemplate';
export default class Parser {
    liquid: Liquid;
    constructor(liquid: Liquid);
    parse(tokens: Array<Token>): ITemplate[];
    parseToken(token: Token, remainTokens: Array<Token>): Tag | Output | HTML;
    parseStream(tokens: Array<Token>): ParseStream;
}
