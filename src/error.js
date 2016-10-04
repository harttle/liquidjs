function TokenizationError(message, input, line) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;

    this.message = message || "";
    this.input = input;
    this.line = line;
}
TokenizationError.prototype = Object.create(Error.prototype);
TokenizationError.prototype.constructor = TokenizationError;

function ParseError(message, input, line, e) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.originalError = e;

    this.message = message || "";
    this.input = input;
    this.line = line;
}
ParseError.prototype = Object.create(Error.prototype);
ParseError.prototype.constructor = ParseError;

module.exports = {
    TokenizationError, ParseError
};
