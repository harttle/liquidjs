const util = require('util');

function TokenizationError(message, input, line) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;

    this.message = message || "";
    this.input = input;
    this.line = line;
}
util.inherits(TokenizationError, Error);

function ParseError(message, input, line) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;

    this.message = message || "";
    this.input = input;
    this.line = line;
}
util.inherits(ParseError, Error);

module.exports = {
    TokenizationError, ParseError
};
