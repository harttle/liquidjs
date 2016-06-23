function TokenizationError(message, input, line, stack) {
    this.name = "TokenizationError";
    this.message = (message || "");
    this.input = input;
    this.line = line;
    if(stack) this.stack = stack;
}
TokenizationError.prototype = Error.prototype;

function ParseError(message, input, line, stack) {
    this.name = "ParseError";
    this.message = (message || "");
    this.input = input;
    this.line = line;
    if(stack) this.stack = stack;
}
ParseError.prototype = Error.prototype;

module.exports = {
    TokenizationError, ParseError
};
