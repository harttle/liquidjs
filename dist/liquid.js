(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Liquid = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//const strftime = require('strftime').timezone(-(new Date()).getTimezoneOffset());
var strftime = require('./src/strftime.js');

module.exports = function (liquid) {
    liquid.registerFilter('abs', function (v) {
        return Math.abs(v);
    });
    liquid.registerFilter('append', function (v, arg) {
        return v + arg;
    });
    liquid.registerFilter('capitalize', function (str) {
        return (str || '').charAt(0).toUpperCase() + str.slice(1);
    });
    liquid.registerFilter('ceil', function (v) {
        return Math.ceil(v);
    });

    //liquid.registerFilter('date', (v, arg) => strftime(arg, v));
    liquid.registerFilter('date', function (v, arg) {
        return strftime(v, arg);
    });

    liquid.registerFilter('default', function (v, arg) {
        return arg || v;
    });
    liquid.registerFilter('divided_by', function (v, arg) {
        return Math.floor(v / arg);
    });
    liquid.registerFilter('downcase', function (v) {
        return v.toLowerCase();
    });

    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&#34;',
        "'": '&#39;'
    };

    function escape(str) {
        return (str || '').replace(/&|<|>|"|'/g, function (m) {
            return escapeMap[m];
        });
    }
    liquid.registerFilter('escape', escape);

    var unescapeMap = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&#34;': '"',
        '&#39;': "'"
    };

    function unescape(str) {
        return (str || '').replace(/&(amp|lt|gt|#34|#39);/g, function (m) {
            return unescapeMap[m];
        });
    }
    liquid.registerFilter('escape_once', function (str) {
        return escape(unescape(str));
    });
    liquid.registerFilter('first', function (v) {
        return v[0];
    });
    liquid.registerFilter('floor', function (v) {
        return Math.floor(v);
    });
    liquid.registerFilter('join', function (v, arg) {
        return v.join(arg);
    });
    liquid.registerFilter('last', function (v) {
        return v[v.length - 1];
    });
    liquid.registerFilter('lstrip', function (v) {
        return (v || '').replace(/^\s+/, '');
    });
    liquid.registerFilter('map', function (arr, arg) {
        return arr.map(function (v) {
            return v[arg];
        });
    });
    liquid.registerFilter('minus', bindFixed(function (v, arg) {
        return v - arg;
    }));
    liquid.registerFilter('modulo', bindFixed(function (v, arg) {
        return v % arg;
    }));
    liquid.registerFilter('newline_to_br', function (v) {
        return v.replace(/\n/g, '<br />');
    });
    liquid.registerFilter('plus', bindFixed(function (v, arg) {
        return v + arg;
    }));
    liquid.registerFilter('prepend', function (v, arg) {
        return arg + v;
    });
    liquid.registerFilter('remove', function (v, arg) {
        return v.split(arg).join('');
    });
    liquid.registerFilter('remove_first', function (v, l) {
        return v.replace(l, '');
    });
    liquid.registerFilter('replace', function (v, pattern, replacement) {
        return (v || '').split(pattern).join(replacement);
    });
    liquid.registerFilter('replace_first', function (v, arg1, arg2) {
        return (v || '').replace(arg1, arg2);
    });
    liquid.registerFilter('reverse', function (v) {
        return (v || '').reverse();
    });
    liquid.registerFilter('round', function (v, arg) {
        var amp = Math.pow(10, arg || 0);
        return Math.round(v * amp, arg) / amp;
    });
    liquid.registerFilter('rstrip', function (str) {
        return (str || '').replace(/\s+$/, '');
    });
    liquid.registerFilter('size', function (v) {
        return v.length;
    });
    liquid.registerFilter('slice', function (v, begin, length) {
        return v.substr(begin, length === undefined ? 1 : length);
    });
    liquid.registerFilter('sort', function (v, arg) {
        return (v || '').sort(arg);
    });
    liquid.registerFilter('split', function (v, arg) {
        return (v || '').split(arg);
    });
    liquid.registerFilter('strip', function (v) {
        return (v || '').trim();
    });
    liquid.registerFilter('strip_html', function (v) {
        return (v || '').replace(/<\/?\s*\w+\s*\/?>/g, '');
    });
    liquid.registerFilter('strip_newlines', function (v) {
        return (v || '').replace(/\n/g, '');
    });
    liquid.registerFilter('times', function (v, arg) {
        return v * arg;
    });
    liquid.registerFilter('truncate', function (v, l, o) {
        v = v || '';
        o = o === undefined ? '...' : o;
        l = l || 16;
        if (v.length <= l) return v;
        return v.substr(0, l - o.length) + o;
    });
    liquid.registerFilter('truncatewords', function (v, l, o) {
        if (o === undefined) o = '...';
        var arr = v.split(' ');
        var ret = arr.slice(0, l).join(' ');
        if (arr.length > l) ret += o;
        return ret;
    });
    liquid.registerFilter('uniq', function (arr) {
        var u = {};
        return (arr || []).filter(function (val) {
            if (u.hasOwnProperty(val)) {
                return false;
            }
            u[val] = true;
            return true;
        });
    });
    liquid.registerFilter('upcase', function (str) {
        return (str || '').toUpperCase();
    });
    liquid.registerFilter('url_encode', encodeURIComponent);
};

function getFixed(v) {
    var p = (v + "").split(".");
    return p.length > 1 ? p[1].length : 0;
}

function getMaxFixed(l, r) {
    return Math.max(getFixed(l), getFixed(r));
}

function bindFixed(cb) {
    return function (l, r) {
        var f = getMaxFixed(l, r);
        return cb(l, r).toFixed(f);
    };
}

},{"./src/strftime.js":14}],2:[function(require,module,exports){
'use strict';

var Scope = require('./src/scope');
var tokenizer = require('./src/tokenizer.js');
var fs = require('fs');
var Render = require('./src/render.js');
var lexical = require('./src/lexical.js');
var Tag = require('./src/tag.js');
var Filter = require('./src/filter.js');
var Template = require('./src/parser');
var Expression = require('./src/expression.js');
var tags = require('./tags');
var filters = require('./filters');
var Promise = require('any-promise');

var _engine = {
    init: function init(tag, filter, options) {
        if (options.cache) {
            this.cache = {};
        }
        this.options = options;
        this.tag = tag;
        this.filter = filter;
        this.parser = Template(tag, filter);
        this.renderer = Render();

        tags(this);
        filters(this);

        return this;
    },
    parse: function parse(html) {
        var tokens = tokenizer.parse(html);
        return this.parser.parse(tokens);
    },
    render: function render(tpl, ctx, opts) {
        opts = opts || {};
        opts.strict_variables = opts.strict_variables || false;
        opts.strict_filters = opts.strict_filters || false;

        this.renderer.resetRegisters();
        var scope = Scope.factory(ctx, {
            strict: opts.strict_variables
        });
        return this.renderer.renderTemplates(tpl, scope, opts);
    },
    parseAndRender: function parseAndRender(html, ctx, opts) {
        try {
            var tpl = this.parse(html);
            return this.render(tpl, ctx, opts);
        } catch (error) {
            // A throw inside of a then or catch of a Promise automatically rejects, but since we mix a sync call
            //  with an async call, we need to do this in case the sync call throws.
            return Promise.reject(error);
        }
    },
    renderFile: function renderFile(filepath, ctx, opts) {
        var _this = this;

        return this.handleCache(filepath).then(function (templates) {
            return _this.render(templates, ctx, opts);
        }).catch(function (e) {
            e.file = filepath;
            throw e;
        });
    },
    evalOutput: function evalOutput(str, scope) {
        var tpl = this.parser.parseOutput(str.trim());
        return this.renderer.evalOutput(tpl, scope);
    },
    registerFilter: function registerFilter(name, filter) {
        return this.filter.register(name, filter);
    },
    registerTag: function registerTag(name, tag) {
        return this.tag.register(name, tag);
    },
    handleCache: function handleCache(filepath) {
        var _this2 = this;

        if (!filepath) throw new Error('filepath cannot be null');

        return this.getTemplate(filepath).then(function (html) {
            var tpl = _this2.options.cache && _this2.cache[filepath] || _this2.parse(html);
            return _this2.options.cache ? _this2.cache[filepath] = tpl : tpl;
        });
    },
    getTemplate: function getTemplate(filepath) {
        filepath = resolvePath(this.options.root, filepath);

        if (!filepath.match(/\.\w+$/)) {
            filepath += this.options.extname;
        }
        return new Promise(function (resolve, reject) {
            fs.readFile(filepath, 'utf8', function (err, html) {
                err ? reject(err) : resolve(html);
            });
        });
    },
    express: function express(renderingOptions) {
        var _this3 = this;

        return function (filePath, options, callback) {
            _this3.renderFile(filePath, options, renderingOptions).then(function (html) {
                return callback(null, html);
            }).catch(function (e) {
                return callback(e);
            });
        };
    }
};

function factory(options) {
    options = options || {};
    options.root = options.root || '';
    options.extname = options.extname || '.liquid';

    var engine = Object.create(_engine);

    engine.init(Tag(), Filter(), options);
    return engine;
}

function resolvePath(root, path) {
    if (path[0] == '/') return path;

    var arr = root.split('/').concat(path.split('/'));
    var result = [];
    arr.forEach(function (slug) {
        if (slug == '..') result.pop();else if (!slug || slug == '.') ;else result.push(slug);
    });
    return '/' + result.join('/');
}

factory.lexical = lexical;
factory.isTruthy = Expression.isTruthy;
factory.isFalsy = Expression.isFalsy;
factory.evalExp = Expression.evalExp;
factory.evalValue = Expression.evalValue;

module.exports = factory;

},{"./filters":1,"./src/expression.js":8,"./src/filter.js":9,"./src/lexical.js":10,"./src/parser":11,"./src/render.js":12,"./src/scope":13,"./src/tag.js":16,"./src/tokenizer.js":17,"./tags":28,"any-promise":3,"fs":6}],3:[function(require,module,exports){
'use strict';

module.exports = require('./register')().Promise;

},{"./register":5}],4:[function(require,module,exports){
"use strict";
// global key for user preferred registration

var REGISTRATION_KEY = '@@any-promise/REGISTRATION',

// Prior registration (preferred or detected)
registered = null;

/**
 * Registers the given implementation.  An implementation must
 * be registered prior to any call to `require("any-promise")`,
 * typically on application load.
 *
 * If called with no arguments, will return registration in
 * following priority:
 *
 * For Node.js:
 *
 * 1. Previous registration
 * 2. global.Promise if node.js version >= 0.12
 * 3. Auto detected promise based on first sucessful require of
 *    known promise libraries. Note this is a last resort, as the
 *    loaded library is non-deterministic. node.js >= 0.12 will
 *    always use global.Promise over this priority list.
 * 4. Throws error.
 *
 * For Browser:
 *
 * 1. Previous registration
 * 2. window.Promise
 * 3. Throws error.
 *
 * Options:
 *
 * Promise: Desired Promise constructor
 * global: Boolean - Should the registration be cached in a global variable to
 * allow cross dependency/bundle registration?  (default true)
 */
module.exports = function (root, loadImplementation) {
  return function register(implementation, opts) {
    implementation = implementation || null;
    opts = opts || {};
    // global registration unless explicitly  {global: false} in options (default true)
    var registerGlobal = opts.global !== false;

    // load any previous global registration
    if (registered === null && registerGlobal) {
      registered = root[REGISTRATION_KEY] || null;
    }

    if (registered !== null && implementation !== null && registered.implementation !== implementation) {
      // Throw error if attempting to redefine implementation
      throw new Error('any-promise already defined as "' + registered.implementation + '".  You can only register an implementation before the first ' + ' call to require("any-promise") and an implementation cannot be changed');
    }

    if (registered === null) {
      // use provided implementation
      if (implementation !== null && typeof opts.Promise !== 'undefined') {
        registered = {
          Promise: opts.Promise,
          implementation: implementation
        };
      } else {
        // require implementation if implementation is specified but not provided
        registered = loadImplementation(implementation);
      }

      if (registerGlobal) {
        // register preference globally in case multiple installations
        root[REGISTRATION_KEY] = registered;
      }
    }

    return registered;
  };
};

},{}],5:[function(require,module,exports){
"use strict";

module.exports = require('./loader')(window, loadImplementation);

/**
 * Browser specific loadImplementation.  Always uses `window.Promise`
 *
 * To register a custom implementation, must register with `Promise` option.
 */
function loadImplementation() {
  if (typeof window.Promise === 'undefined') {
    throw new Error("any-promise browser requires a polyfill or explicit registration" + " e.g: require('any-promise/register/bluebird')");
  }
  return {
    Promise: window.Promise,
    implementation: 'window.Promise'
  };
}

},{"./loader":4}],6:[function(require,module,exports){
"use strict";

},{}],7:[function(require,module,exports){
"use strict";

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
    TokenizationError: TokenizationError, ParseError: ParseError
};

},{}],8:[function(require,module,exports){
'use strict';

var syntax = require('./syntax.js');
var lexical = require('./lexical.js');

function evalExp(exp, scope) {
    if (!scope) throw new Error('unable to evalExp: scope undefined');
    var operatorREs = lexical.operators,
        match;
    for (var i = 0; i < operatorREs.length; i++) {
        var operatorRE = operatorREs[i];
        var expRE = new RegExp('^(' + lexical.quoteBalanced.source + ')(' + operatorRE.source + ')(' + lexical.quoteBalanced.source + ')$');
        if (match = exp.match(expRE)) {
            var l = evalExp(match[1], scope);
            var op = syntax.operators[match[2].trim()];
            var r = evalExp(match[3], scope);
            return op(l, r);
        }
    }

    if (match = exp.match(lexical.rangeLine)) {
        var low = evalValue(match[1], scope),
            high = evalValue(match[2], scope);
        var range = [];
        for (var j = low; j <= high; j++) {
            range.push(j);
        }
        return range;
    }

    return evalValue(exp, scope);
}

function evalValue(str, scope) {
    str = str && str.trim();
    if (!str) return undefined;

    if (lexical.isLiteral(str)) {
        return lexical.parseLiteral(str);
    }
    if (lexical.isVariable(str)) {
        return scope.get(str);
    }
}

function isTruthy(val) {
    if (val instanceof Array) return !!val.length;
    return !!val;
}

function isFalsy(val) {
    return !isTruthy(val);
}

module.exports = {
    evalExp: evalExp, evalValue: evalValue, isTruthy: isTruthy, isFalsy: isFalsy
};

},{"./lexical.js":10,"./syntax.js":15}],9:[function(require,module,exports){
'use strict';

var lexical = require('./lexical.js');
var Exp = require('./expression.js');

var valueRE = new RegExp('' + lexical.value.source, 'g');

module.exports = function () {
    var filters = {};

    var _filterInstance = {
        render: function render(output, scope) {
            var args = this.args.map(function (arg) {
                return Exp.evalValue(arg, scope);
            });
            args.unshift(output);
            return this.filter.apply(null, args);
        },
        parse: function parse(str) {
            var match = lexical.filterLine.exec(str);
            if (!match) throw new Error('illegal filter: ' + str);

            var name = match[1],
                argList = match[2] || '',
                filter = filters[name];
            if (typeof filter !== 'function') {
                return {
                    name: name,
                    error: new Error('undefined filter: ' + name)
                };
            }

            var args = [];
            while (match = valueRE.exec(argList.trim())) {
                args.push(match[0]);
            }

            this.name = name;
            this.filter = filter;
            this.args = args;

            return this;
        }
    };

    function construct(str) {
        var instance = Object.create(_filterInstance);
        return instance.parse(str);
    }

    function register(name, filter) {
        filters[name] = filter;
    }

    function clear() {
        filters = {};
    }

    return {
        construct: construct, register: register, clear: clear
    };
};

},{"./expression.js":8,"./lexical.js":10}],10:[function(require,module,exports){
'use strict';

// quote related
var singleQuoted = /'[^']*'/;
var doubleQuoted = /"[^"]*"/;
var quoteBalanced = new RegExp('(?:' + singleQuoted.source + '|' + doubleQuoted.source + '|[^\'"])*');

var number = /(?:-?\d+\.?\d*|\.?\d+)/;
var bool = /true|false/;
var identifier = /[a-zA-Z_$][a-zA-Z_$0-9]*/;
var subscript = /\[\d+\]/;

var quoted = new RegExp('(?:' + singleQuoted.source + '|' + doubleQuoted.source + ')');
var literal = new RegExp('(?:' + quoted.source + '|' + bool.source + '|' + number.source + ')');
var variable = new RegExp(identifier.source + '(?:\\.' + identifier.source + '|' + subscript.source + ')*');

// range related
var rangeLimit = new RegExp('(?:' + variable.source + '|' + number.source + ')');
var range = new RegExp('\\(' + rangeLimit.source + '\\.\\.' + rangeLimit.source + '\\)');
var rangeCapture = new RegExp('\\((' + rangeLimit.source + ')\\.\\.(' + rangeLimit.source + ')\\)');

var value = new RegExp('(?:' + literal.source + '|' + variable.source + '|' + range.source + ')');

// hash related
var hash = new RegExp('(?:' + identifier.source + ')\\s*:\\s*(?:' + value.source + ')');
var hashCapture = new RegExp('(' + identifier.source + ')\\s*:\\s*(' + value.source + ')', 'g');

var tagLine = new RegExp('^\\s*(' + identifier.source + ')\\s*(.*)\\s*$');
var literalLine = new RegExp('^' + literal.source + '$', 'i');
var variableLine = new RegExp('^' + variable.source + '$');
var numberLine = new RegExp('^' + number.source + '$');
var boolLine = new RegExp('^' + bool.source + '$', 'i');
var quotedLine = new RegExp('^' + quoted.source + '$');
var rangeLine = new RegExp('^' + rangeCapture.source + '$');

// filter related
var valueList = new RegExp(value.source + '(\\s*,\\s*' + value.source + ')*');
var filter = new RegExp(identifier.source + '(?:\\s*:\\s*' + valueList.source + ')?', 'g');
var filterCapture = new RegExp('(' + identifier.source + ')(?:\\s*:\\s*(' + valueList.source + '))?');
var filterLine = new RegExp('^' + filterCapture.source + '$');

var operators = [/\s+or\s+/, /\s+and\s+/, /==|!=|<=|>=|<|>|\s+contains\s+/];

function isLiteral(str) {
    return literalLine.test(str);
}

function isRange(str) {
    return rangeLine.test(str);
}

function isVariable(str) {
    return variableLine.test(str);
}

function parseLiteral(str) {
    var res;
    if (res = str.match(numberLine)) {
        return Number(str);
    }
    if (res = str.match(boolLine)) {
        return str.toLowerCase() === 'true';
    }
    if (res = str.match(quotedLine)) {
        return str.slice(1, -1);
    }
}

module.exports = {
    quoted: quoted, number: number, bool: bool, literal: literal, filter: filter,
    hash: hash, hashCapture: hashCapture,
    range: range, rangeCapture: rangeCapture,
    identifier: identifier, value: value, quoteBalanced: quoteBalanced, operators: operators,
    quotedLine: quotedLine, numberLine: numberLine, boolLine: boolLine, rangeLine: rangeLine, literalLine: literalLine, filterLine: filterLine, tagLine: tagLine,
    isLiteral: isLiteral, isVariable: isVariable, parseLiteral: parseLiteral, isRange: isRange
};

},{}],11:[function(require,module,exports){
'use strict';

var lexical = require('./lexical.js');
var ParseError = require('./error.js').ParseError;

module.exports = function (Tag, Filter) {

    var stream = {
        init: function init(tokens) {
            this.tokens = tokens;
            this.handlers = {};
            return this;
        },
        on: function on(name, cb) {
            this.handlers[name] = cb;
            return this;
        },
        trigger: function trigger(event, arg) {
            var h = this.handlers[event];
            if (typeof h === 'function') {
                h(arg);
                return true;
            }
        },
        start: function start() {
            this.trigger('start');
            var token;
            while (!this.stopRequested && (token = this.tokens.shift())) {
                if (this.trigger('token', token)) continue;
                if (token.type == 'tag' && this.trigger('tag:' + token.name, token)) {
                    continue;
                }
                var template = parseToken(token, this.tokens);
                this.trigger('template', template);
            }
            if (!this.stopRequested) this.trigger('end');
            return this;
        },
        stop: function stop() {
            this.stopRequested = true;
            return this;
        }
    };

    function parse(tokens) {
        var token,
            templates = [];
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
            throw new ParseError(e.message, token.input, token.line, e);
        }
    }

    function parseTag(token, tokens) {
        if (token.name === 'continue' || token.name === 'break') return token;
        return Tag.construct(token, tokens);
    }

    function parseOutput(str) {
        var match = lexical.value.exec(str);
        if (!match) throw new Error('illegal output string: ' + str);

        var initial = match[0];
        str = str.substr(match.index + match[0].length);

        var filters = [];
        while (match = lexical.filter.exec(str)) {
            filters.push([match[0].trim()]);
        }

        return {
            type: 'output',
            initial: initial,
            filters: filters.map(function (str) {
                return Filter.construct(str);
            })
        };
    }

    function parseStream(tokens) {
        var s = Object.create(stream);
        return s.init(tokens);
    }

    return {
        parse: parse, parseTag: parseTag, parseStream: parseStream, parseOutput: parseOutput
    };
};

},{"./error.js":7,"./lexical.js":10}],12:[function(require,module,exports){
'use strict';

var Exp = require('./expression.js');
var Promise = require('any-promise');

var render = {

    renderTemplates: function renderTemplates(templates, scope, opts) {
        var _this = this;

        if (!scope) throw new Error('unable to evalTemplates: scope undefined');
        opts = opts || {};
        opts.strict_filters = opts.strict_filters || false;

        var html = '';

        // This executes an array of promises sequentially for every template in the templates array - http://webcache.googleusercontent.com/search?q=cache:rNbMUn9TPtkJ:joost.vunderink.net/blog/2014/12/15/processing-an-array-of-promises-sequentially-in-node-js/+&cd=5&hl=en&ct=clnk&gl=us
        // It's fundamentally equivalent to the following...
        //  emptyPromise.then(renderTag(template0).then(renderTag(template1).then(renderTag(template2)...
        var lastPromise = templates.reduce(function (promise, template) {
            return promise.then(function (partial) {
                if (scope.safeGet('forloop.skip')) {
                    return Promise.resolve('');
                }
                if (scope.safeGet('forloop.stop')) {
                    throw new Error('forloop.stop'); // this will stop/break the sequential promise chain and go to the catch
                }

                var promiseLink = Promise.resolve('');
                switch (template.type) {
                    case 'tag':
                        // Add Promises to the chain
                        promiseLink = _this.renderTag(template, scope, _this.register).then(function (partial) {
                            if (partial === undefined) {
                                return true; // basically a noop (do nothing)
                            }
                            return html += partial;
                        });
                        break;
                    case 'html':
                        promiseLink = Promise.resolve(template.value).then(function (partial) {
                            return html += partial;
                        });
                        break;
                    case 'output':
                        var val = _this.evalOutput(template, scope, opts);
                        promiseLink = Promise.resolve(val === undefined ? '' : stringify(val)).then(function (partial) {
                            return html += partial;
                        });
                        break;
                }

                return promiseLink;
            }).catch(function (error) {
                if (error.message === 'forloop.skip') {
                    // the error is a controlled, purposeful stop. so just return the html that we have up to this point
                    return html;
                } else {
                    // rethrow actual error
                    throw error;
                }
            });
        }, Promise.resolve('')); // start the reduce chain with a resolved Promise. After first run, the "promise" argument
        //  in our reduce callback will be the returned promise from our "then" above.  In this
        //  case, that's the promise returned from this.renderTag or a resolved promise with raw html.

        return lastPromise.then(function (renderedHtml) {
            return renderedHtml;
        }).catch(function (error) {
            throw error;
        });
    },

    renderTag: function renderTag(template, scope, register) {
        if (template.name === 'continue') {
            scope.set('forloop.skip', true);
            return Promise.resolve('');
        }
        if (template.name === 'break') {
            scope.set('forloop.stop', true);
            scope.set('forloop.skip', true);
            return Promise.reject(new Error('forloop.stop')); // this will stop the sequential promise chain
        }
        return template.render(scope, register);
    },

    evalOutput: function evalOutput(template, scope, opts) {
        if (!scope) throw new Error('unable to evalOutput: scope undefined');
        var val = Exp.evalExp(template.initial, scope);
        template.filters.some(function (filter) {
            if (filter.error) {
                if (opts.strict_filters) {
                    throw filter.error;
                } else {
                    // render as null
                    val = '';
                    return true;
                }
            }
            val = filter.render(val, scope);
        });
        return val;
    },

    resetRegisters: function resetRegisters() {
        return this.register = {};
    }
};

function factory() {
    var instance = Object.create(render);
    instance.register = {};
    return instance;
}

function stringify(val) {
    if (typeof val === 'string') return val;
    return JSON.stringify(val);
}

module.exports = factory;

},{"./expression.js":8,"any-promise":3}],13:[function(require,module,exports){
'use strict';

var Scope = {
    safeGet: function safeGet(str) {
        var i;
        // get all
        if (str === undefined) {
            var ctx = {};
            for (i = this.scopes.length - 1; i >= 0; i--) {
                var scp = this.scopes[i];
                for (var k in scp) {
                    if (scp.hasOwnProperty(k)) {
                        ctx[k] = scp[k];
                    }
                }
            }
            return ctx;
        }
        // get one path
        for (i = this.scopes.length - 1; i >= 0; i--) {
            var v = getPropertyByPath(this.scopes[i], str);
            if (v !== undefined) return v;
        }
    },
    get: function get(str) {
        var val = this.safeGet(str);
        if (val === undefined && this.opts.strict) {
            throw new Error('[strict_variables] undefined variable: ' + str);
        }
        return val;
    },
    set: function set(k, v) {
        setPropertyByPath(this.scopes[this.scopes.length - 1], k, v);
        return this;
    },
    push: function push(ctx) {
        if (!ctx) throw new Error('trying to push ' + ctx + ' into scopes');
        return this.scopes.push(ctx);
    },
    pop: function pop() {
        return this.scopes.pop();
    }
};

function setPropertyByPath(obj, path, val) {
    if (path instanceof String || typeof path === 'string') {
        var paths = path.replace(/\[/g, '.').replace(/\]/g, '').split('.');
        for (var i = 0; i < paths.length; i++) {
            var key = paths[i];
            if (i === paths.length - 1) {
                return obj[key] = val;
            }
            if (undefined === obj[key]) obj[key] = {};
            // case for readonly objects
            obj = obj[key] || {};
        }
        return obj;
    }
    return obj[path] = val;
}

function getPropertyByPath(obj, path) {
    if (path instanceof String || typeof path === 'string') {
        var paths = path.replace(/\[/g, '.').replace(/\]/g, '').split('.');
        paths.forEach(function (p) {
            return obj = obj && obj[p];
        });
        return obj;
    }
    return obj[path];
}

exports.factory = function (_ctx, opts) {
    opts = opts || {};
    opts.strict = opts.strict || false;

    var scope = Object.create(Scope);
    scope.opts = opts;
    scope.scopes = [_ctx || {}];
    return scope;
};

},{}],14:[function(require,module,exports){
"use strict";

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var suffixes = {
    1: 'st',
    2: 'nd',
    3: 'rd',
    'default': 'th'
};

// prototype extensions
var _date = {
    daysInMonth: function daysInMonth(d) {
        var feb = _date.isLeapYear(d) ? 29 : 28;
        return [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    },

    getTimezone: function getTimezone(d) {
        return d.toString().replace(/^.*? ([A-Z]{3}) [0-9]{4}.*$/, "$1").replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, "$1$2$3");
    },

    getGMTOffset: function getGMTOffset(d) {
        return (d.getTimezoneOffset() > 0 ? "-" : "+") + _number.pad(Math.floor(d.getTimezoneOffset() / 60), 2) + _number.pad(d.getTimezoneOffset() % 60, 2);
    },

    getDayOfYear: function getDayOfYear(d) {
        var num = 0;
        for (var i = 0; i < d.getMonth(); ++i) {
            num += _date.daysInMonth(d)[i];
        }
        return num + d.getDate();
    },

    // Startday is an integer of which day to start the week measuring from
    // TODO: that comment was retarted. fix it.
    getWeekOfYear: function getWeekOfYear(d, startDay) {
        // Skip to startDay of this week
        var now = this.getDayOfYear(d) + (startDay - d.getDay());
        // Find the first startDay of the year
        var jan1 = new Date(d.getFullYear(), 0, 1);
        var then = 7 - jan1.getDay() + startDay;
        return _number.pad(Math.floor((now - then) / 7) + 1, 2);
    },

    isLeapYear: function isLeapYear(d) {
        var year = d.getFullYear();
        return !!((year & 3) === 0 && (year % 100 || year % 400 === 0 && year));
    },

    getFirstDayOfMonth: function getFirstDayOfMonth(d) {
        var day = (d.getDay() - (d.getDate() - 1)) % 7;
        return day < 0 ? day + 7 : day;
    },

    getLastDayOfMonth: function getLastDayOfMonth(d) {
        var day = (d.getDay() + (_date.daysInMonth(d)[d.getMonth()] - d.getDate())) % 7;
        return day < 0 ? day + 7 : day;
    },

    getSuffix: function getSuffix(d) {
        var str = d.getDate().toString();
        var index = parseInt(str.slice(-1));
        return suffixes[index] || suffixes['default'];
    },

    applyOffset: function applyOffset(date, offset_seconds) {
        date.setTime(date.valueOf() - offset_seconds * 1000);
        return date;
    },

    century: function century(d) {
        return parseInt(d.getFullYear().toString().substring(0, 2), 10);
    }
};

var _obj = {
    values_of: function values_of(obj) {
        var values = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                values.push(obj[k]);
            }
        }
        return values;
    }
};

var _number = {
    pad: function pad(value, size, ch) {
        if (!ch) ch = '0';
        var result = value.toString();
        var pad = size - result.length;

        while (pad-- > 0) {
            result = ch + result;
        }

        return result;
    }
};

var format_codes = {
    a: function a(d) {
        return dayNamesShort[d.getDay()];
    },
    A: function A(d) {
        return dayNames[d.getDay()];
    },
    b: function b(d) {
        return monthNamesShort[d.getMonth()];
    },
    B: function B(d) {
        return monthNames[d.getMonth()];
    },
    c: function c(d) {
        return d.toLocaleString();
    },
    C: function C(d) {
        return _date.century(d);
    },
    d: function d(_d) {
        return _number.pad(_d.getDate(), 2);
    },
    e: function e(d) {
        return _number.pad(d.getDate(), 2, ' ');
    },
    H: function H(d) {
        return _number.pad(d.getHours(), 2);
    },
    I: function I(d) {
        return _number.pad(d.getHours() % 12 || 12, 2);
    },
    j: function j(d) {
        return _number.pad(_date.getDayOfYear(d), 3);
    },
    k: function k(d) {
        return _number.pad(d.getHours(), 2, ' ');
    },
    l: function l(d) {
        return _number.pad(d.getHours() % 12 || 12, 2, ' ');
    },
    L: function L(d) {
        return _number.pad(d.getMilliseconds(), 3);
    },
    m: function m(d) {
        return _number.pad(d.getMonth() + 1, 2);
    },
    M: function M(d) {
        return _number.pad(d.getMinutes(), 2);
    },
    p: function p(d) {
        return d.getHours() < 12 ? 'AM' : 'PM';
    },
    P: function P(d) {
        return d.getHours() < 12 ? 'am' : 'pm';
    },
    q: function q(d) {
        return _date.getSuffix(d);
    },
    s: function s(d) {
        return Math.round(d.valueOf() / 1000);
    },
    S: function S(d) {
        return _number.pad(d.getSeconds(), 2);
    },
    u: function u(d) {
        return d.getDay() || 7;
    },
    U: function U(d) {
        return _date.getWeekOfYear(d, 0);
    },
    w: function w(d) {
        return d.getDay();
    },
    W: function W(d) {
        return _date.getWeekOfYear(d, 1);
    },
    x: function x(d) {
        return d.toLocaleDateString();
    },
    X: function X(d) {
        return d.toLocaleTimeString();
    },
    y: function y(d) {
        return d.getFullYear().toString().substring(2, 4);
    },
    Y: function Y(d) {
        return d.getFullYear();
    },
    // TODO: guessing the pad function won't work with negative numbers?
    // TODO: getTimezoneOffset returns a positive number for GMT-7. Verify my
    // assumption that it will return negative for GMT+x
    z: function z(d) {
        var tz = d.getTimezoneOffset() / 60 * 100;
        return (tz > 0 ? '-' : '+') + _number.pad(tz, 4);
    },
    "%": function _() {
        return '%';
    }
};
format_codes.h = format_codes.b;
format_codes.N = format_codes.L;

// * r stands for regex, p stands for parser
// * all parseInt calls have to have the base supplied as the second
//   parameter, otherwise they will default to octal when parsing numbers
//   with leading zeros. This is most evident when parsing a date with 08 as
//   the minutes / year as 08 is an invalid octal number, and so returns 0
var parse_codes = {
    a: {
        r: "(?:" + dayNamesShort.join("|") + ")"
    },
    A: {
        r: "(?:" + dayNames.join("|") + ")"
    },
    b: {
        r: "(" + monthNamesShort.join("|") + ")",
        p: function p(data) {
            this.month = $.inArray(data, monthNamesShort);
        }
    },
    B: {
        r: "(" + monthNames.join("|") + ")",
        p: function p(data) {
            this.month = $.inArray(data, monthNames);
        }
    },
    C: {
        r: "(\\d{1,2})",
        p: function p(d) {
            this.century = parseInt(d, 10);
        }
    },
    d: {
        r: "(\\d{1,2})",
        p: function p(d) {
            this.day = parseInt(d, 10);
        }
    },
    H: {
        r: "(\\d{1,2})",
        p: function p(d) {
            this.hour = parseInt(d, 10);
        }
    },
    // This gives only the day. Parsing of the month happens at the end because
    // we also need the year
    j: {
        r: "(\\d{1,3})",
        p: function p(d) {
            this.day = parseInt(d, 10);
        }
    },
    L: {
        r: "(\\d{3})",
        p: function p(d) {
            this.milliseconds = parseInt(d, 10);
        }
    },
    m: {
        r: "(\\d{1,2})",
        p: function p(d) {
            this.month = parseInt(d, 10) - 1;
        }
    },
    M: {
        r: "(\\d{2})",
        p: function p(d) {
            this.minute = parseInt(d, 10);
        }
    },
    p: {
        r: "(AM|PM)",
        p: function p(d) {
            if (d == 'AM') {
                if (this.hour == 12) {
                    this.hour = 0;
                }
            } else {
                if (this.hour < 12) {
                    this.hour += 12;
                }
            }
        }
    },
    P: {
        r: "(am|pm)",
        p: function p(d) {
            if (d == 'am') {
                if (this.hour == 12) {
                    this.hour = 0;
                }
            } else {
                if (this.hour < 12) {
                    this.hour += 12;
                }
            }
        }
    },
    q: {
        r: "(?:" + _obj.values_of(suffixes).join('|') + ")"
    },
    S: {
        r: "(\\d{2})",
        p: function p(d) {
            this.second = parseInt(d, 10);
        }
    },
    y: {
        r: "(\\d{1,2})",
        p: function p(d) {
            this.year = parseInt(d, 10);
        }
    },
    Y: {
        r: "(\\d{4})",
        p: function p(d) {
            this.century = Math.floor(parseInt(d, 10) / 100);
            this.year = parseInt(d, 10) % 100;
        }
    },
    z: { // "Z", "+05:00", "+0500" all acceptable.
        r: "(Z|[+-]\\d{2}:?\\d{2})",
        p: function p(d) {
            // UTC, no offset.
            if (d == "Z") {
                this.zone = 0;
                return;
            }

            var seconds = parseInt(d[0] + d[1] + d[2], 10) * 3600; // e.g., "+05" or "-08"
            if (d[3] == ":") {
                // "+HH:MM" is preferred iso8601 format
                seconds += parseInt(d[4] + d[5], 10) * 60;
            } else {
                // "+HHMM" is frequently used, though.
                seconds += parseInt(d[3] + d[4], 10) * 60;
            }
            this.zone = seconds;
        }
    }
};
parse_codes.e = parse_codes.d;
parse_codes.h = parse_codes.b;
parse_codes.I = parse_codes.H;
parse_codes.k = parse_codes.H;
parse_codes.l = parse_codes.H;

var strftime = function strftime(d, format) {
    // I used to use string split with a regex and a capturing block here,
    // which I thought was really clever, but apparently this exact feature is
    // fucked in IE. In every other browser (and languages), the captured
    // blocks are present in the output. E.g.
    // var pairs = "hello%athere".split(/(%.)/);
    // => ['hello', '%a', 'there']
    // IE however, just treats it the same as if no capturing block is present
    // => ['hello', 'there']
    // An alternate implementation of split is available here
    // http://blog.stevenlevithan.com/archives/cross-browser-split
    // Because that's a large amount of code for this one specific use case,
    // I've just decided to loop through a regex instead.

    var output = '';
    var remaining = format;

    while (true) {
        var r = /%./g;
        var results = r.exec(remaining);

        // No more format codes. Add the remaining text and return
        if (!results) {
            return output + remaining;
        }

        // Add the preceding text
        output += remaining.slice(0, r.lastIndex - 2);
        remaining = remaining.slice(r.lastIndex);

        // Add the format code
        var ch = results[0].charAt(1);
        var func = format_codes[ch];
        output += func ? func.call(this, d) : '%' + ch;
    }
};

module.exports = strftime;

},{}],15:[function(require,module,exports){
'use strict';

var operators = {
    '==': function _(l, r) {
        return l == r;
    },
    '!=': function _(l, r) {
        return l != r;
    },
    '>': function _(l, r) {
        return l > r;
    },
    '<': function _(l, r) {
        return l < r;
    },
    '>=': function _(l, r) {
        return l >= r;
    },
    '<=': function _(l, r) {
        return l <= r;
    },
    'contains': function contains(l, r) {
        return l.indexOf(r) > -1;
    },
    'and': function and(l, r) {
        return l && r;
    },
    'or': function or(l, r) {
        return l || r;
    }
};

exports.operators = operators;

},{}],16:[function(require,module,exports){
'use strict';

var lexical = require('./lexical.js');
var Promise = require('any-promise');
var Exp = require('./expression.js');

function hash(markup, scope) {
    var obj = {},
        match;
    lexical.hashCapture.lastIndex = 0;
    while (match = lexical.hashCapture.exec(markup)) {
        var k = match[1],
            v = match[2];
        obj[k] = Exp.evalValue(v, scope);
    }
    return obj;
}

module.exports = function () {
    var tagImpls = {};

    var _tagInstance = {
        render: function render(scope, register) {
            var reg = register[this.name];
            if (!reg) reg = register[this.name] = {};
            var obj = hash(this.token.args, scope);
            return this.tagImpl.render && this.tagImpl.render(scope, obj, reg) || Promise.resolve('');
        },
        parse: function parse(token, tokens) {
            this.type = 'tag';
            this.token = token;
            this.name = token.name;

            var tagImpl = tagImpls[this.name];
            if (!tagImpl) throw new Error('tag ' + this.name + ' not found');
            this.tagImpl = Object.create(tagImpl);
            if (this.tagImpl.parse) {
                this.tagImpl.parse(token, tokens);
            }
        }
    };

    function register(name, tag) {
        tagImpls[name] = tag;
    }

    function construct(token, tokens) {
        var instance = Object.create(_tagInstance);
        instance.parse(token, tokens);
        return instance;
    }

    function clear() {
        tagImpls = {};
    }

    return {
        construct: construct, register: register, clear: clear
    };
};

},{"./expression.js":8,"./lexical.js":10,"any-promise":3}],17:[function(require,module,exports){
'use strict';

var lexical = require('./lexical.js');
var TokenizationError = require('./error.js').TokenizationError;

function parse(html) {
    var tokens = [];
    if (!html) return tokens;

    var syntax = /({%(.*?)%})|({{(.*?)}})/g;
    var result, htmlFragment, token;
    var lastMatchEnd = 0,
        lastMatchBegin = -1,
        parsedLinesCount = 0;

    while ((result = syntax.exec(html)) !== null) {
        // passed html fragments
        if (result.index > lastMatchEnd) {
            htmlFragment = html.slice(lastMatchEnd, result.index);
            tokens.push({
                type: 'html',
                raw: htmlFragment,
                value: htmlFragment
            });
        }
        // tag appeared
        if (result[1]) {
            token = factory('tag', 1, result);

            var match = token.value.match(lexical.tagLine);
            if (!match) {
                throw new TokenizationError('illegal tag: ' + token.raw, token.input, token.line);
            }
            token.name = match[1];
            token.args = match[2];

            tokens.push(token);
        }
        // output
        else {
                token = factory('output', 3, result);
                tokens.push(token);
            }
        lastMatchEnd = syntax.lastIndex;
    }

    // remaining html
    if (html.length > lastMatchEnd) {
        htmlFragment = html.slice(lastMatchEnd, html.length);
        tokens.push({
            type: 'html',
            raw: htmlFragment,
            value: htmlFragment
        });
    }
    return tokens;

    function factory(type, offset, match) {
        return {
            type: type,
            raw: match[offset],
            value: match[offset + 1].trim(),
            line: getLineNum(match),
            input: getLineContent(match)
        };
    }

    function getLineContent(match) {
        var idx1 = match.input.lastIndexOf('\n', match.index);
        var idx2 = match.input.indexOf('\n', match.index);
        if (idx2 === -1) idx2 = match.input.length;
        return match.input.slice(idx1 + 1, idx2);
    }

    function getLineNum(match) {
        var lines = match.input.slice(lastMatchBegin + 1, match.index).split('\n');
        parsedLinesCount += lines.length - 1;
        lastMatchBegin = match.index;
        return parsedLinesCount + 1;
    }
}

exports.parse = parse;

},{"./error.js":7,"./lexical.js":10}],18:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;
var Promise = require('any-promise');
var re = new RegExp('(' + lexical.identifier.source + ')\\s*=(.*)');

module.exports = function (liquid) {

    liquid.registerTag('assign', {
        parse: function parse(token) {
            var match = token.args.match(re);
            if (!match) throw new Error('illegal token ' + token.raw);
            this.key = match[1];
            this.value = match[2];
        },
        render: function render(scope, hash) {
            scope.set(this.key, liquid.evalOutput(this.value, scope));
            return Promise.resolve('');
        }
    });
};

},{"..":2,"any-promise":3}],19:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;
var re = new RegExp('(' + lexical.identifier.source + ')');

module.exports = function (liquid) {

    liquid.registerTag('capture', {
        parse: function parse(tagToken, remainTokens) {
            var _this = this;

            var match = tagToken.args.match(re);
            if (!match) throw new Error(tagToken.args + ' not valid identifier');

            this.variable = match[1];
            this.templates = [];

            var stream = liquid.parser.parseStream(remainTokens);
            stream.on('tag:endcapture', function (token) {
                return stream.stop();
            }).on('template', function (tpl) {
                return _this.templates.push(tpl);
            }).on('end', function (x) {
                throw new Error('tag ' + tagToken.raw + ' not closed');
            });
            stream.start();
        },
        render: function render(scope, hash) {
            var _this2 = this;

            return liquid.renderer.renderTemplates(this.templates, scope).then(function (html) {
                scope.set(_this2.variable, html);
            });
        }
    });
};

},{"..":2}],20:[function(require,module,exports){
'use strict';

var Liquid = require('..');

module.exports = function (liquid) {
    liquid.registerTag('case', {

        parse: function parse(tagToken, remainTokens) {
            var _this = this;

            this.cond = tagToken.args;
            this.cases = [];
            this.elseTemplates = [];

            var p = [],
                stream = liquid.parser.parseStream(remainTokens).on('tag:when', function (token) {
                if (!_this.cases[token.args]) {
                    _this.cases.push({
                        val: token.args,
                        templates: p = []
                    });
                }
            }).on('tag:else', function (token) {
                return p = _this.elseTemplates;
            }).on('tag:endcase', function (token) {
                return stream.stop();
            }).on('template', function (tpl) {
                return p.push(tpl);
            }).on('end', function (x) {
                throw new Error('tag ' + tagToken.raw + ' not closed');
            });

            stream.start();
        },

        render: function render(scope, hash) {
            for (var i = 0; i < this.cases.length; i++) {
                var branch = this.cases[i];
                var val = Liquid.evalExp(branch.val, scope);
                var cond = Liquid.evalExp(this.cond, scope);
                if (val === cond) {
                    return liquid.renderer.renderTemplates(branch.templates, scope);
                }
            }
            return liquid.renderer.renderTemplates(this.elseTemplates, scope);
        }

    });
};

},{"..":2}],21:[function(require,module,exports){
'use strict';

module.exports = function (liquid) {

    liquid.registerTag('comment', {
        parse: function parse(tagToken, remainTokens) {
            var stream = liquid.parser.parseStream(remainTokens);
            stream.on('token', function (token) {
                if (token.name === 'endcomment') stream.stop();
            }).on('end', function (x) {
                throw new Error('tag ' + tagToken.raw + ' not closed');
            });
            stream.start();
        }
    });
};

},{}],22:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var Promise = require('any-promise');
var lexical = Liquid.lexical;
var groupRE = new RegExp('^(?:(' + lexical.value.source + ')\\s*:\\s*)?(.*)$');
var candidatesRE = new RegExp(lexical.value.source, 'g');

module.exports = function (liquid) {
    liquid.registerTag('cycle', {

        parse: function parse(tagToken, remainTokens) {
            var match = groupRE.exec(tagToken.args);
            if (!match) throw new Error('illegal tag: ' + tagToken.raw);

            this.group = match[1] || '';
            var candidates = match[2];

            this.candidates = [];

            while (match = candidatesRE.exec(candidates)) {
                this.candidates.push(match[0]);
            }

            if (!this.candidates.length) {
                throw new Error('empty candidates: ' + tagToken.raw);
            }
        },

        render: function render(scope, hash, register) {
            var fingerprint = Liquid.evalValue(this.group, scope) + ':' + this.candidates.join(',');
            var idx = register[fingerprint];

            if (idx === undefined) {
                idx = register[fingerprint] = 0;
            }

            var candidate = this.candidates[idx];
            idx = (idx + 1) % this.candidates.length;
            register[fingerprint] = idx;

            return Promise.resolve(Liquid.evalValue(candidate, scope));
        }
    });
};

},{"..":2,"any-promise":3}],23:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;

module.exports = function (liquid) {

    liquid.registerTag('decrement', {
        parse: function parse(token) {
            var match = token.args.match(lexical.identifier);
            if (!match) throw new Error('illegal identifier ' + token.args);
            this.variable = match[0];
        },
        render: function render(scope, hash) {
            var v = scope.get(this.variable);
            if (typeof v !== 'number') v = 0;
            scope.set(this.variable, v - 1);
        }
    });
};

},{"..":2}],24:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var Promise = require('any-promise');
var lexical = Liquid.lexical;
var re = new RegExp('^(' + lexical.identifier.source + ')\\s+in\\s+' + ('(' + lexical.value.source + ')') + ('(?:\\s+' + lexical.hash.source + ')*') + '(?:\\s+(reversed))?$');

module.exports = function (liquid) {
    liquid.registerTag('for', {

        parse: function parse(tagToken, remainTokens) {
            var _this = this;

            var match = re.exec(tagToken.args);
            if (!match) throw new Error('illegal tag: ' + tagToken.raw);
            this.variable = match[1];
            this.collection = match[2];
            this.reversed = !!match[3];

            this.templates = [];
            this.elseTemplates = [];

            var p,
                stream = liquid.parser.parseStream(remainTokens).on('start', function (x) {
                return p = _this.templates;
            }).on('tag:else', function (token) {
                return p = _this.elseTemplates;
            }).on('tag:endfor', function (token) {
                return stream.stop();
            }).on('template', function (tpl) {
                return p.push(tpl);
            }).on('end', function (x) {
                throw new Error('tag ' + tagToken.raw + ' not closed');
            });

            stream.start();
        },

        render: function render(scope, hash) {
            var _this2 = this;

            var collection = Liquid.evalExp(this.collection, scope);
            if (Liquid.isFalsy(collection)) {
                return liquid.renderer.renderTemplates(this.elseTemplates, scope);
            }

            var html = '';
            var length = collection.length;
            var offset = hash.offset || 0;
            var limit = hash.limit === undefined ? collection.length : hash.limit;

            collection = collection.slice(offset, offset + limit);
            if (this.reversed) collection.reverse();

            // for needs to execute the promises sequentially, not just resolve them sequentially, due to break and continue.
            // We can't just loop through executing everything then resolve them all sequentially like we do for render.renderTemplates
            // First, we build the array of parameters we are going to use for each call to renderTemplates
            var contexts = [];
            collection.some(function (item, i) {
                var ctx = {};
                ctx[_this2.variable] = item;
                ctx.forloop = {
                    first: i === 0,
                    index: i + 1,
                    index0: i,
                    last: i === length - 1,
                    length: length,
                    rindex: length - i,
                    rindex0: length - i - 1,
                    stop: false,
                    skip: false
                };
                // We are just putting together an array of the arguments we will be passing to our sequential promises
                contexts.push(ctx);
            });

            // This is some pretty tricksy javascript, at least to me.
            // This executes an array of promises sequentially for every argument in the contexts array - http://webcache.googleusercontent.com/search?q=cache:rNbMUn9TPtkJ:joost.vunderink.net/blog/2014/12/15/processing-an-array-of-promises-sequentially-in-node-js/+&cd=5&hl=en&ct=clnk&gl=us
            // It's fundamentally equivalent to the following...
            //  emptyPromise.then(renderTemplates(args0).then(renderTemplates(args1).then(renderTemplates(args2)...
            var lastPromise = contexts.reduce(function (promise, context) {
                return promise.then(function (partial) {
                    if (scope.get('forloop.stop')) {
                        throw new Error('forloop.stop'); // this will stop the sequential promise chain
                    }

                    return html += partial;
                }).then(function (partial) {
                    // todo: Make sure our scope management is sound here.  Create some tests that revolve around loops
                    //  with sections that take differing amounts of time to complete.  Make sure the order is maintained
                    //  and scope doesn't bleed over into other renderTemplate calls.
                    scope.push(context);
                    return liquid.renderer.renderTemplates(_this2.templates, scope);
                }).then(function (partial) {
                    scope.pop(context);
                    return partial;
                });
            }, Promise.resolve('')); // start the reduce chain with a resolved Promise. After first run, the "promise" argument
            //  in our reduce callback will be the returned promise from our "then" above.  In this
            //  case, the promise returned from liquid.renderer.renderTemplates.

            return lastPromise.then(function (partial) {
                return html += partial;
            }).catch(function (error) {
                if (error.message === 'forloop.stop') {
                    // the error is a controlled, purposeful stop. so just return the html that we have up to this point
                    return html;
                } else {
                    // rethrow actual error
                    throw error;
                }
            });
        }
    });
};

},{"..":2,"any-promise":3}],25:[function(require,module,exports){
'use strict';

var Liquid = require('..');

module.exports = function (liquid) {
    liquid.registerTag('if', {

        parse: function parse(tagToken, remainTokens) {
            var _this = this;

            this.branches = [];
            this.elseTemplates = [];

            var p,
                stream = liquid.parser.parseStream(remainTokens).on('start', function (x) {
                return _this.branches.push({
                    cond: tagToken.args,
                    templates: p = []
                });
            }).on('tag:elsif', function (token) {
                if (!_this.branches[token.args]) {
                    _this.branches.push({
                        cond: token.args,
                        templates: p = []
                    });
                }
            }).on('tag:else', function (token) {
                return p = _this.elseTemplates;
            }).on('tag:endif', function (token) {
                return stream.stop();
            }).on('template', function (tpl) {
                return p.push(tpl);
            }).on('end', function (x) {
                throw new Error('tag ' + tagToken.raw + ' not closed');
            });

            stream.start();
        },

        render: function render(scope, hash) {
            for (var i = 0; i < this.branches.length; i++) {
                var branch = this.branches[i];
                var cond = Liquid.evalExp(branch.cond, scope);
                if (Liquid.isTruthy(cond)) {
                    return liquid.renderer.renderTemplates(branch.templates, scope);
                }
            }
            return liquid.renderer.renderTemplates(this.elseTemplates, scope);
        }

    });
};

},{"..":2}],26:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;
var withRE = new RegExp('with\\s+(' + lexical.value.source + ')');

module.exports = function (liquid) {

    liquid.registerTag('include', {
        parse: function parse(token) {
            var match = lexical.value.exec(token.args);
            if (!match) throw new Error('illegal token ' + token.raw);
            this.value = match[0];

            match = withRE.exec(token.args);
            if (match) {
                this.with = match[1];
            }
        },
        render: function render(scope, hash) {
            var filepath = Liquid.evalValue(this.value, scope);
            if (this.with) {
                hash[filepath] = Liquid.evalValue(this.with, scope);
            }
            return liquid.handleCache(filepath).then(function (templates) {
                scope.push(hash);
                return liquid.renderer.renderTemplates(templates, scope);
            }).then(function (html) {
                scope.pop();
                return html;
            });
        }
    });
};

},{"..":2}],27:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;

module.exports = function (liquid) {

    liquid.registerTag('increment', {
        parse: function parse(token) {
            var match = token.args.match(lexical.identifier);
            if (!match) throw new Error('illegal identifier ' + token.args);
            this.variable = match[0];
        },
        render: function render(scope, hash) {
            var v = scope.get(this.variable);
            if (typeof v !== 'number') v = 0;
            scope.set(this.variable, v + 1);
        }
    });
};

},{"..":2}],28:[function(require,module,exports){
"use strict";

module.exports = function (engine) {
    require("./assign.js")(engine);
    require("./capture.js")(engine);
    require("./case.js")(engine);
    require("./comment.js")(engine);
    require("./cycle.js")(engine);
    require("./decrement.js")(engine);
    require("./for.js")(engine);
    require("./if.js")(engine);
    require("./include.js")(engine);
    require("./increment.js")(engine);
    require("./layout.js")(engine);
    require("./raw.js")(engine);
    require("./tablerow.js")(engine);
    require("./unless.js")(engine);
};

},{"./assign.js":18,"./capture.js":19,"./case.js":20,"./comment.js":21,"./cycle.js":22,"./decrement.js":23,"./for.js":24,"./if.js":25,"./include.js":26,"./increment.js":27,"./layout.js":29,"./raw.js":30,"./tablerow.js":31,"./unless.js":32}],29:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var Promise = require('any-promise');
var lexical = Liquid.lexical;

module.exports = function (liquid) {

    liquid.registerTag('layout', {
        parse: function parse(token, remainTokens) {
            var match = lexical.value.exec(token.args);
            if (!match) throw new Error('illegal token ' + token.raw);

            this.layout = match[0];
            this.tpls = liquid.parser.parse(remainTokens);
        },
        render: function render(scope, hash) {
            var layout = Liquid.evalValue(this.layout, scope);

            var html = '';
            scope.push({});
            // not sure if this first one is needed, since the results are ignored
            return liquid.renderer.renderTemplates(this.tpls, scope).then(function (partial) {
                html += partial;
                return liquid.handleCache(layout);
            }).then(function (templates) {
                return liquid.renderer.renderTemplates(templates, scope);
            }).then(function (partial) {
                scope.pop();
                return partial;
            }).catch(function (e) {
                e.file = layout;
                throw e;
            });
        }
    });

    liquid.registerTag('block', {
        parse: function parse(token, remainTokens) {
            var _this = this;

            var match = /\w+/.exec(token.args);
            this.block = match ? match[0] : '';

            this.tpls = [];
            var p,
                stream = liquid.parser.parseStream(remainTokens).on('tag:endblock', function (token) {
                return stream.stop();
            }).on('template', function (tpl) {
                return _this.tpls.push(tpl);
            }).on('end', function (x) {
                throw new Error('tag ' + token.raw + ' not closed');
            });
            stream.start();
        },
        render: function render(scope, hash) {
            var _this2 = this;

            var html = scope.get('_liquid.blocks.' + this.block);
            var promise = Promise.resolve('');
            if (html === undefined) {
                promise = liquid.renderer.renderTemplates(this.tpls, scope).then(function (partial) {
                    scope.set('_liquid.blocks.' + _this2.block, partial);
                    return partial;
                });
            } else {
                scope.set('_liquid.blocks.' + this.block, html);
                promise = Promise.resolve(html);
            }
            return promise;
        }
    });
};

},{"..":2,"any-promise":3}],30:[function(require,module,exports){
'use strict';

var Promise = require('any-promise');

module.exports = function (liquid) {

    liquid.registerTag('raw', {
        parse: function parse(tagToken, remainTokens) {
            var _this = this;

            this.tokens = [];

            var stream = liquid.parser.parseStream(remainTokens);
            stream.on('token', function (token) {
                if (token.name === 'endraw') stream.stop();else _this.tokens.push(token);
            }).on('end', function (x) {
                throw new Error('tag ' + tagToken.raw + ' not closed');
            });
            stream.start();
        },
        render: function render(scope, hash) {
            var tokens = this.tokens.map(function (token) {
                return token.raw;
            }).join('');
            return Promise.resolve(tokens);
        }
    });
};

},{"any-promise":3}],31:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var Promise = require('any-promise');
var lexical = Liquid.lexical;
var re = new RegExp('^(' + lexical.identifier.source + ')\\s+in\\s+' + ('(' + lexical.value.source + ')') + ('(?:\\s+' + lexical.hash.source + ')*$'));

module.exports = function (liquid) {
    liquid.registerTag('tablerow', {

        parse: function parse(tagToken, remainTokens) {
            var _this = this;

            var match = re.exec(tagToken.args);
            if (!match) throw new Error('illegal tag: ' + tagToken.raw);
            this.variable = match[1];
            this.collection = match[2];

            this.templates = [];

            var p,
                stream = liquid.parser.parseStream(remainTokens).on('start', function (x) {
                return p = _this.templates;
            }).on('tag:endtablerow', function (token) {
                return stream.stop();
            }).on('template', function (tpl) {
                return p.push(tpl);
            }).on('end', function (x) {
                throw new Error('tag ' + tagToken.raw + ' not closed');
            });

            stream.start();
        },

        render: function render(scope, hash) {
            var _this2 = this;

            var collection = Liquid.evalExp(this.collection, scope) || [];

            var html = '<table>';
            var offset = hash.offset || 0;
            var limit = hash.limit === undefined ? collection.length : hash.limit;

            var cols = hash.cols,
                row,
                col;
            if (!cols) throw new Error('illegal cols: ' + cols);

            // build array of arguments to pass to sequential promises...
            collection = collection.slice(offset, offset + limit);
            var contexts = [];
            collection.some(function (item, i) {
                var ctx = {};
                ctx[_this2.variable] = item;
                // We are just putting together an array of the arguments we will be passing to our sequential promises
                contexts.push(ctx);
            });

            // This executes an array of promises sequentially for every argument in the contexts array - http://webcache.googleusercontent.com/search?q=cache:rNbMUn9TPtkJ:joost.vunderink.net/blog/2014/12/15/processing-an-array-of-promises-sequentially-in-node-js/+&cd=5&hl=en&ct=clnk&gl=us
            // It's fundamentally equivalent to the following...
            //  emptyPromise.then(renderTemplates(args0).then(renderTemplates(args1).then(renderTemplates(args2)...
            var lastPromise = contexts.reduce(function (promise, context, currentIndex) {
                return promise.then(function (partial) {
                    row = Math.floor(currentIndex / cols) + 1;
                    col = currentIndex % cols + 1;
                    if (col === 1) {
                        if (row !== 1) {
                            html += '</tr>';
                        }
                        html += '<tr class="row' + row + '">';
                    }

                    //ctx[this.variable] = context;

                    return html += '<td class="col' + col + '">';
                }).then(function (partial) {
                    scope.push(context);
                    return liquid.renderer.renderTemplates(_this2.templates, scope);
                }).then(function (partial) {
                    scope.pop(context);
                    html += partial;
                    return html += '</td>';
                });
            }, Promise.resolve('')); // start the reduce chain with a resolved Promise. After first run, the "promise" argument
            //  in our reduce callback will be the returned promise from our "then" above.  In this
            //  case, the promise returned from liquid.renderer.renderTemplates.

            return lastPromise.then(function () {
                if (row > 0) {
                    html += '</tr>';
                }
                html += '</table>';
                return html;
            }).catch(function (error) {
                throw error;
            });
        }
    });
};

},{"..":2,"any-promise":3}],32:[function(require,module,exports){
'use strict';

var Liquid = require('..');

module.exports = function (liquid) {
    liquid.registerTag('unless', {
        parse: function parse(tagToken, remainTokens) {
            var _this = this;

            this.templates = [];
            this.elseTemplates = [];
            var p,
                stream = liquid.parser.parseStream(remainTokens).on('start', function (x) {
                p = _this.templates;
                _this.cond = tagToken.args;
            }).on('tag:else', function (token) {
                return p = _this.elseTemplates;
            }).on('tag:endunless', function (token) {
                return stream.stop();
            }).on('template', function (tpl) {
                return p.push(tpl);
            }).on('end', function (x) {
                throw new Error('tag ' + tagToken.raw + ' not closed');
            });

            stream.start();
        },

        render: function render(scope, hash) {
            var cond = Liquid.evalExp(this.cond, scope);
            return Liquid.isFalsy(cond) ? liquid.renderer.renderTemplates(this.templates, scope) : liquid.renderer.renderTemplates(this.elseTemplates, scope);
        }
    });
};

},{"..":2}]},{},[2])(2)
});