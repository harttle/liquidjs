function TokenizationError(message, input, line) {
    if(Error.captureStackTrace){
        Error.captureStackTrace(this, this.constructor);
    }
    this.name = this.constructor.name;

    this.message = message;
    this.input = input;
    this.line = line;
}
TokenizationError.prototype = Object.create(Error.prototype);
TokenizationError.prototype.constructor = TokenizationError;

function ParseError(message, input, line, e) {
    if(Error.captureStackTrace){
        Error.captureStackTrace(this, this.constructor);
    }
    this.name = this.constructor.name;
    this.originalError = e;

    this.message = message;
    this.input = input;
    this.line = line;
}
ParseError.prototype = Object.create(Error.prototype);
ParseError.prototype.constructor = ParseError;

function RenderBreak(message){
    if(Error.captureStackTrace){
        Error.captureStackTrace(this, this.constructor);
    }
    this.name = this.constructor.name;
    this.message = message;
}
RenderBreak.prototype = Object.create(Error.prototype);
RenderBreak.prototype.constructor = RenderBreak;

function AssertionError(message){
    if(Error.captureStackTrace){
        Error.captureStackTrace(this, this.constructor);
    }
    this.name = this.constructor.name;
    this.message = message;
}
AssertionError.prototype = Object.create(Error.prototype);
AssertionError.prototype.constructor = AssertionError;

module.exports = {
    TokenizationError, ParseError, RenderBreak, AssertionError
};
