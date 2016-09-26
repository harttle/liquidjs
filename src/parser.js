const lexical = require('./lexical.js');
const ParseError = require('./error.js').ParseError;

module.exports = function(Tag, Filter) {

    var stream = {
        init: function(tokens) {
            this.tokens = tokens;
            this.handlers = {};
            return this;
        },
        on: function(name, cb) {
            this.handlers[name] = cb;
            return this;
        },
        trigger: function(event, arg) {
            var h = this.handlers[event];
            if (typeof h === 'function') {
                h(arg);
                return true;
            }
        },
        start: function() {
            this.trigger('start');
            while (!this.stopRequested && (token = this.tokens.shift())) {
                if (this.trigger('token', token)) continue;
                if (token.type == 'tag' &&
                    this.trigger(`tag:${token.name}`, token)) {
                    continue;
                }
                var template = parseToken(token, this.tokens);
                this.trigger('template', template);
            }
            if (!this.stopRequested) this.trigger('end');
            return this;
        },
        stop: function() {
            this.stopRequested = true;
            return this;
        }
    };

    function parse(tokens) {
        var token, templates = [];
        while (token = tokens.shift()) {
            templates.push(parseToken(token, tokens));
        }
        return templates;
    }

    function parseToken(token, tokens) {
        try {
            switch (token.type) {
                case 'tag':
                    return parseTag(token, tokens);
                case 'output':
                    return parseOutput(token.value);
                case 'html':
                    return token;
            }
        } catch (e) {
            throw new ParseError(e.message, token.input, token.line);
        }
    }

    function parseTag(token, tokens) {
        if (token.name === 'continue' || token.name === 'break') return token;
        return Tag.construct(token, tokens);
    }

    function parseOutput(str) {
        var match = lexical.value.exec(str);
        if(!match) throw new Error(`illegal output string: ${str}`);

        var initial = match[0];
        str = str.substr(match.index + match[0].length);

        var filters = [];
        while(match = lexical.filter.exec(str)){
            filters.push([match[0].trim()]);
        }

        return {
            type: 'output',
            initial: initial,
            filters: filters.map(str => Filter.construct(str))
        };
    }

    function parseStream(tokens) {
        var s = Object.create(stream);
        return s.init(tokens);
    }

    return {
        parse, parseTag, parseStream, parseOutput
    };
};
