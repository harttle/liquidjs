const lexical = require('./lexical.js');
const error = require('./error.js');

module.exports = function(Tag) {

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
                var template;
                if (token.type == 'tag') {
                    if (this.trigger(`tag:${token.name}`, token)) continue;
                    template = parseTag(token, this.tokens);
                } else {
                    template = token;
                }
                this.trigger('template', template);
            }
            if (!this.stopRequested) this.trigger('end');
            return this;
        },
        stop: function() {
            this.stopRequested = true;
            return this;
        },
        onStart: function(cb) {
            return this.on('start', cb);
        },
        onEnd: function(cb) {
            return this.on('end', cb);
        },
        onTag: function(name, cb) {
            return this.on(`tag:${name}`, cb);
        },
        onTemplate: function(cb) {
            return this.on('template', cb);
        }
    };

    function parse(tokens) {
        var templates = [];
        var token;
        while (token = tokens.shift()) {
            if (token.type === 'tag') {
                var tagInstance = parseTag(token, tokens);
                templates.push(tagInstance);
            } else templates.push(token);
        }
        return templates;
    }

    function parseTag(token, tokens) {
        return Tag.construct(token).parse(tokens);
    }


    function parseStream(tokens) {
        var s = Object.create(stream);
        return s.init(tokens);
    }

    return {
        parse, parseTag, parseStream
    };
};
