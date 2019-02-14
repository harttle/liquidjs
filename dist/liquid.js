/*
 * liquidjs@7.0.0, https://github.com/harttle/liquidjs
 * (c) 2016-2019 harttle
 * Released under the MIT License.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Liquid = factory());
}(this, function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var toStr = Object.prototype.toString;
    var arrToStr = Array.prototype.toString;
    /*
     * Checks if value is classified as a String primitive or object.
     * @param {any} value The value to check.
     * @return {Boolean} Returns true if value is a string, else false.
     */
    function isString(value) {
        return toStr.call(value) === '[object String]';
    }
    function isFunction(value) {
        return typeof value === 'function';
    }
    function stringify(value) {
        if (isNil(value))
            return String(value);
        if (isFunction(value.to_liquid))
            return stringify(value.to_liquid());
        if (isFunction(value.toLiquid))
            return stringify(value.toLiquid());
        if (isFunction(value.to_s))
            return value.to_s();
        if ([toStr, arrToStr].indexOf(value.toString) > -1)
            return defaultToString(value);
        if (isFunction(value.toString))
            return value.toString();
        return toStr.call(value);
    }
    function defaultToString(value) {
        var cache = [];
        return JSON.stringify(value, function (key, value) {
            if (isObject(value)) {
                if (cache.indexOf(value) !== -1) {
                    return;
                }
                cache.push(value);
            }
            return value;
        });
    }
    function create(proto) {
        return Object.create(proto);
    }
    function isNil(value) {
        return value === null || value === undefined;
    }
    function isArray(value) {
        // be compatible with IE 8
        return toStr.call(value) === '[object Array]';
    }
    /*
     * Iterates over own enumerable string keyed properties of an object and invokes iteratee for each property.
     * The iteratee is invoked with three arguments: (value, key, object).
     * Iteratee functions may exit iteration early by explicitly returning false.
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @return {Object} Returns object.
     */
    function forOwn(object, iteratee) {
        object = object || {};
        for (var k in object) {
            if (object.hasOwnProperty(k)) {
                if (iteratee(object[k], k, object) === false)
                    break;
            }
        }
        return object;
    }
    /*
     * Assigns own enumerable string keyed properties of source objects to the destination object.
     * Source objects are applied from left to right.
     * Subsequent sources overwrite property assignments of previous sources.
     *
     * Note: This method mutates object and is loosely based on Object.assign.
     *
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @return {Object} Returns object.
     */
    function assign(obj) {
        var srcs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            srcs[_i - 1] = arguments[_i];
        }
        obj = isObject(obj) ? obj : {};
        srcs.forEach(function (src) { return binaryAssign(obj, src); });
        return obj;
    }
    function binaryAssign(target, src) {
        for (var key in src)
            if (src.hasOwnProperty(key))
                target[key] = src[key];
    }
    function last(arr) {
        return arr[arr.length - 1];
    }
    /*
     * Checks if value is the language type of Object.
     * (e.g. arrays, functions, objects, regexes, new Number(0), and new String(''))
     * @param {any} value The value to check.
     * @return {Boolean} Returns true if value is an object, else false.
     */
    function isObject(value) {
        var type = typeof value;
        return value !== null && (type === 'object' || type === 'function');
    }
    /*
     * A function to create flexibly-numbered lists of integers,
     * handy for each and map loops. start, if omitted, defaults to 0; step defaults to 1.
     * Returns a list of integers from start (inclusive) to stop (exclusive),
     * incremented (or decremented) by step, exclusive.
     * Note that ranges that stop before they start are considered to be zero-length instead of
     * negative — if you'd like a negative range, use a negative step.
     */
    function range(start, stop, step) {
        if (arguments.length === 1) {
            stop = start;
            start = 0;
        }
        step = step || 1;
        var arr = [];
        for (var i = start; i < stop; i += step) {
            arr.push(i);
        }
        return arr;
    }

    // quote related
    var singleQuoted = /'[^']*'/;
    var doubleQuoted = /"[^"]*"/;
    var quoted = new RegExp(singleQuoted.source + "|" + doubleQuoted.source);
    var quoteBalanced = new RegExp("(?:" + quoted.source + "|[^'\"])*");
    // basic types
    var integer = /-?\d+/;
    var number = /-?\d+\.?\d*|\.?\d+/;
    var bool = /true|false/;
    // property access
    var identifier = /[\w-]+[?]?/;
    var subscript = new RegExp("\\[(?:" + quoted.source + "|[\\w-\\.]+)\\]");
    var literal = new RegExp("(?:" + quoted.source + "|" + bool.source + "|" + number.source + ")");
    var variable = new RegExp(identifier.source + "(?:\\." + identifier.source + "|" + subscript.source + ")*");
    // range related
    var rangeLimit = new RegExp("(?:" + variable.source + "|" + number.source + ")");
    var range$1 = new RegExp("\\(" + rangeLimit.source + "\\.\\." + rangeLimit.source + "\\)");
    var rangeCapture = new RegExp("\\((" + rangeLimit.source + ")\\.\\.(" + rangeLimit.source + ")\\)");
    var value = new RegExp("(?:" + variable.source + "|" + literal.source + "|" + range$1.source + ")");
    // hash related
    var hash = new RegExp("(?:" + identifier.source + ")\\s*:\\s*(?:" + value.source + ")");
    var hashCapture = new RegExp("(" + identifier.source + ")\\s*:\\s*(" + value.source + ")", 'g');
    // full match
    var tagLine = new RegExp("^\\s*(" + identifier.source + ")\\s*([\\s\\S]*)\\s*$");
    var literalLine = new RegExp("^" + literal.source + "$", 'i');
    var variableLine = new RegExp("^" + variable.source + "$");
    var numberLine = new RegExp("^" + number.source + "$");
    var boolLine = new RegExp("^" + bool.source + "$", 'i');
    var quotedLine = new RegExp("^" + quoted.source + "$");
    var rangeLine = new RegExp("^" + rangeCapture.source + "$");
    var integerLine = new RegExp("^" + integer.source + "$");
    // filter related
    var valueDeclaration = new RegExp("(?:" + identifier.source + "\\s*:\\s*)?" + value.source);
    var valueList = new RegExp(valueDeclaration.source + "(\\s*,\\s*" + valueDeclaration.source + ")*");
    var filter = new RegExp(identifier.source + "(?:\\s*:\\s*" + valueList.source + ")?", 'g');
    var filterCapture = new RegExp("(" + identifier.source + ")(?:\\s*:\\s*(" + valueList.source + "))?");
    var filterLine = new RegExp("^" + filterCapture.source + "$");
    var operators = [
        /\s+or\s+/,
        /\s+and\s+/,
        /==|!=|<=|>=|<|>|\s+contains\s+/
    ];
    function isInteger(str) {
        return integerLine.test(str);
    }
    function isLiteral(str) {
        return literalLine.test(str);
    }
    function isVariable(str) {
        return variableLine.test(str);
    }
    function matchValue(str) {
        return value.exec(str);
    }
    function parseLiteral(str) {
        var res = str.match(numberLine);
        if (res) {
            return Number(str);
        }
        res = str.match(boolLine);
        if (res) {
            return str.toLowerCase() === 'true';
        }
        res = str.match(quotedLine);
        if (res) {
            return str.slice(1, -1);
        }
        throw new TypeError("cannot parse '" + str + "' as literal");
    }

    function captureStack() {
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    var LiquidError = /** @class */ (function () {
        function LiquidError(err, token) {
            this.input = token.input;
            this.line = token.line;
            this.file = token.file;
            this.originalError = err;
            this.token = token;
        }
        LiquidError.prototype.captureStackTrace = function (obj) {
            this.name = obj.constructor.name;
            captureStack.call(obj);
            var err = this.originalError;
            var context = mkContext(this.input, this.line);
            this.message = mkMessage(err.message, this.token);
            this.stack = context +
                '\n' + (this.stack || this.message) +
                (err.stack ? '\nFrom ' + err.stack : '');
        };
        return LiquidError;
    }());
    var TokenizationError = /** @class */ (function (_super) {
        __extends(TokenizationError, _super);
        function TokenizationError(message, token) {
            var _this = _super.call(this, { message: message }, token) || this;
            _super.prototype.captureStackTrace.call(_this, _this);
            return _this;
        }
        return TokenizationError;
    }(LiquidError));
    TokenizationError.prototype = create(Error.prototype);
    TokenizationError.prototype.constructor = TokenizationError;
    var ParseError = /** @class */ (function (_super) {
        __extends(ParseError, _super);
        function ParseError(err, token) {
            var _this = _super.call(this, err, token) || this;
            assign(_this, err);
            _super.prototype.captureStackTrace.call(_this, _this);
            return _this;
        }
        return ParseError;
    }(LiquidError));
    ParseError.prototype = create(Error.prototype);
    ParseError.prototype.constructor = ParseError;
    var RenderError = /** @class */ (function (_super) {
        __extends(RenderError, _super);
        function RenderError(err, tpl) {
            var _this = _super.call(this, err, tpl.token) || this;
            assign(_this, err);
            _super.prototype.captureStackTrace.call(_this, _this);
            return _this;
        }
        return RenderError;
    }(LiquidError));
    RenderError.prototype = create(Error.prototype);
    RenderError.prototype.constructor = RenderError;
    var RenderBreakError = /** @class */ (function () {
        function RenderBreakError(message) {
            captureStack.call(this);
            this.message = message + '';
        }
        return RenderBreakError;
    }());
    RenderBreakError.prototype = create(Error.prototype);
    RenderBreakError.prototype.constructor = RenderBreakError;
    var AssertionError = /** @class */ (function () {
        function AssertionError(message) {
            captureStack.call(this);
            this.message = message + '';
        }
        return AssertionError;
    }());
    AssertionError.prototype = create(Error.prototype);
    AssertionError.prototype.constructor = AssertionError;
    function mkContext(input, targetLine) {
        var lines = input.split('\n');
        var begin = Math.max(targetLine - 2, 1);
        var end = Math.min(targetLine + 3, lines.length);
        var context = range(begin, end + 1)
            .map(function (lineNumber) {
            var indicator = (lineNumber === targetLine) ? '>> ' : '   ';
            var num = padStart(String(end).length, lineNumber);
            var text = lines[lineNumber - 1];
            return "" + indicator + num + "| " + text;
        })
            .join('\n');
        return context;
    }
    function mkMessage(msg, token) {
        msg = msg || '';
        if (token.file) {
            msg += ', file:' + token.file;
        }
        if (token.line) {
            msg += ', line:' + token.line;
        }
        return msg;
    }
    function padStart(length, str) {
        str = String(str);
        var blank = Array(length - str.length).join(' ');
        return blank + str;
    }

    function assert (predicate, message) {
        if (!predicate) {
            message = message || "expect " + predicate + " to be true";
            throw new AssertionError(message);
        }
    }

    var Scope = /** @class */ (function () {
        function Scope(ctx, opts) {
            if (ctx === void 0) { ctx = {}; }
            var defaultOptions = {
                dynamicPartials: true,
                strict_variables: false,
                strict_filters: false,
                blocks: {},
                root: []
            };
            this.opts = assign(defaultOptions, opts);
            this.contexts = [ctx || {}];
        }
        Scope.prototype.getAll = function () {
            return this.contexts.reduce(function (ctx, val) { return assign(ctx, val); }, create(null));
        };
        Scope.prototype.get = function (path) {
            var _this = this;
            var paths = this.propertyAccessSeq(path);
            var scope = this.findContextFor(paths[0]) || last(this.contexts);
            return paths.reduce(function (value$$1, key) { return _this.readProperty(value$$1, key); }, scope);
        };
        Scope.prototype.set = function (path, v) {
            var paths = this.propertyAccessSeq(path);
            var scope = this.findContextFor(paths[0]) || last(this.contexts);
            paths.some(function (key, i) {
                if (!isObject(scope)) {
                    return true;
                }
                if (i === paths.length - 1) {
                    scope[key] = v;
                    return true;
                }
                if (undefined === scope[key]) {
                    scope[key] = {};
                }
                scope = scope[key];
            });
        };
        Scope.prototype.unshift = function (ctx) {
            return this.contexts.unshift(ctx);
        };
        Scope.prototype.push = function (ctx) {
            return this.contexts.push(ctx);
        };
        Scope.prototype.pop = function (ctx) {
            if (!arguments.length) {
                return this.contexts.pop();
            }
            var i = this.contexts.findIndex(function (scope) { return scope === ctx; });
            if (i === -1) {
                throw new TypeError('scope not found, cannot pop');
            }
            return this.contexts.splice(i, 1)[0];
        };
        Scope.prototype.findContextFor = function (key, filter$$1) {
            if (filter$$1 === void 0) { filter$$1 = (function (arg) { return true; }); }
            for (var i = this.contexts.length - 1; i >= 0; i--) {
                var candidate = this.contexts[i];
                if (!filter$$1(candidate))
                    continue;
                if (key in candidate) {
                    return candidate;
                }
            }
            return null;
        };
        Scope.prototype.readProperty = function (obj, key) {
            var val;
            if (isNil(obj)) {
                val = undefined;
            }
            else {
                obj = toLiquid(obj);
                val = key === 'size' ? readSize(obj) : obj[key];
                if (isFunction(obj.liquid_method_missing)) {
                    val = obj.liquid_method_missing(key);
                }
            }
            if (isNil(val) && this.opts.strict_variables) {
                throw new TypeError("undefined variable: " + key);
            }
            return val;
        };
        /*
         * Parse property access sequence from access string
         * @example
         * accessSeq("foo.bar")            // ['foo', 'bar']
         * accessSeq("foo['bar']")      // ['foo', 'bar']
         * accessSeq("foo['b]r']")      // ['foo', 'b]r']
         * accessSeq("foo[bar.coo]")    // ['foo', 'bar'], for bar.coo == 'bar'
         */
        Scope.prototype.propertyAccessSeq = function (str) {
            str = String(str);
            var seq = [];
            var name = '';
            var j;
            var i = 0;
            while (i < str.length) {
                switch (str[i]) {
                    case '[':
                        push();
                        var delemiter = str[i + 1];
                        if (/['"]/.test(delemiter)) { // foo["bar"]
                            j = str.indexOf(delemiter, i + 2);
                            assert(j !== -1, "unbalanced " + delemiter + ": " + str);
                            name = str.slice(i + 2, j);
                            push();
                            i = j + 2;
                        }
                        else { // foo[bar.coo]
                            j = matchRightBracket(str, i + 1);
                            assert(j !== -1, "unbalanced []: " + str);
                            name = str.slice(i + 1, j);
                            if (!isInteger(name)) { // foo[bar] vs. foo[1]
                                name = String(this.get(name));
                            }
                            push();
                            i = j + 1;
                        }
                        break;
                    case '.': // foo.bar, foo[0].bar
                        push();
                        i++;
                        break;
                    default: // foo.bar
                        name += str[i];
                        i++;
                }
            }
            push();
            if (!seq.length) {
                throw new TypeError("invalid path:\"" + str + "\"");
            }
            return seq;
            function push() {
                if (name.length)
                    seq.push(name);
                name = '';
            }
        };
        return Scope;
    }());
    function toLiquid(obj) {
        if (isFunction(obj.to_liquid)) {
            return obj.to_liquid();
        }
        if (isFunction(obj.toLiquid)) {
            return obj.toLiquid();
        }
        return obj;
    }
    function readSize(obj) {
        if (!isNil(obj.size))
            return obj.size;
        if (isArray(obj) || isString(obj))
            return obj.length;
        return obj.size;
    }
    function matchRightBracket(str, begin) {
        var stack = 1; // count of '[' - count of ']'
        for (var i = begin; i < str.length; i++) {
            if (str[i] === '[') {
                stack++;
            }
            if (str[i] === ']') {
                stack--;
                if (stack === 0) {
                    return i;
                }
            }
        }
        return -1;
    }

    function domResolve(root, path) {
        var base = document.createElement('base');
        base.href = root;
        var head = document.getElementsByTagName('head')[0];
        head.insertBefore(base, head.firstChild);
        var a = document.createElement('a');
        a.href = path;
        var resolved = a.href;
        head.removeChild(base);
        return resolved;
    }
    function resolve(filepath, root, options) {
        root = root || options.root;
        if (isArray(root)) {
            root = root[0];
        }
        if (root.length && last(root) !== '/') {
            root += '/';
        }
        var url = domResolve(root, filepath);
        return url.replace(/^(\w+:\/\/[^/]+)(\/[^?]+)/, function (str, origin, path) {
            var last$$1 = path.split('/').pop();
            if (/\.\w+$/.test(last$$1)) {
                return str;
            }
            return origin + path + options.extname;
        });
    }
    function read(url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                resolve(xhr.responseText);
                            }
                            else {
                                reject(new Error(xhr.statusText));
                            }
                        };
                        xhr.onerror = function () {
                            reject(new Error('An error occurred whilst receiving the response.'));
                        };
                        xhr.open('GET', url);
                        xhr.send();
                    })];
            });
        });
    }

    function whiteSpaceCtrl(tokens, options) {
        options = assign({ greedy: true }, options);
        var inRaw = false;
        tokens.forEach(function (token, i) {
            if (shouldTrimLeft(token, inRaw, options)) {
                trimLeft(tokens[i - 1], options.greedy);
            }
            if (token.type === 'tag' && token.name === 'raw')
                inRaw = true;
            if (token.type === 'tag' && token.name === 'endraw')
                inRaw = false;
            if (shouldTrimRight(token, inRaw, options)) {
                trimRight(tokens[i + 1], options.greedy);
            }
        });
    }
    function shouldTrimLeft(token, inRaw, options) {
        if (inRaw)
            return false;
        if (token.type === 'tag')
            return token.trim_left || options.trim_tag_left;
        if (token.type === 'value')
            return token.trim_left || options.trim_value_left;
    }
    function shouldTrimRight(token, inRaw, options) {
        if (inRaw)
            return false;
        if (token.type === 'tag')
            return token.trim_right || options.trim_tag_right;
        if (token.type === 'value')
            return token.trim_right || options.trim_value_right;
    }
    function trimLeft(token, greedy) {
        if (!token || token.type !== 'html')
            return;
        var rLeft = greedy ? /\s+$/g : /[\t\r ]*$/g;
        token.value = token.value.replace(rLeft, '');
    }
    function trimRight(token, greedy) {
        if (!token || token.type !== 'html')
            return;
        var rRight = greedy ? /^\s+/g : /^[\t\r ]*\n?/g;
        token.value = token.value.replace(rRight, '');
    }

    function parse(input, file, options) {
        assert(isString(input), 'illegal input');
        var rLiquid = /({%-?([\s\S]*?)-?%})|({{-?([\s\S]*?)-?}})/g;
        var currIndent = 0;
        var lineNumber = LineNumber(input);
        var lastMatchEnd = 0;
        var tokens = [];
        for (var match = void 0; (match = rLiquid.exec(input)); lastMatchEnd = rLiquid.lastIndex) {
            if (match.index > lastMatchEnd) {
                tokens.push(parseHTMLToken(lastMatchEnd, match.index));
            }
            tokens.push(match[1]
                ? parseTagToken(match[1], match[2].trim(), match.index)
                : parseValueToken(match[3], match[4].trim(), match.index));
        }
        if (input.length > lastMatchEnd) {
            tokens.push(parseHTMLToken(lastMatchEnd, input.length));
        }
        whiteSpaceCtrl(tokens, options);
        return tokens;
        function parseTagToken(raw, value$$1, pos) {
            var match = value$$1.match(tagLine);
            var token = {
                type: 'tag',
                indent: currIndent,
                line: lineNumber.get(pos),
                trim_left: raw.slice(0, 3) === '{%-',
                trim_right: raw.slice(-3) === '-%}',
                raw: raw,
                value: value$$1,
                input: input,
                file: file
            };
            if (!match) {
                throw new TokenizationError("illegal tag syntax", token);
            }
            token.name = match[1];
            token.args = match[2];
            return token;
        }
        function parseValueToken(raw, value$$1, pos) {
            return {
                type: 'value',
                line: lineNumber.get(pos),
                trim_left: raw.slice(0, 3) === '{{-',
                trim_right: raw.slice(-3) === '-}}',
                raw: raw,
                value: value$$1,
                input: input,
                file: file
            };
        }
        function parseHTMLToken(begin, end) {
            var htmlFragment = input.slice(begin, end);
            currIndent = last((htmlFragment).split('\n')).length;
            return {
                type: 'html',
                raw: htmlFragment,
                value: htmlFragment
            };
        }
    }
    function LineNumber(html) {
        var parsedLinesCount = 0;
        var lastMatchBegin = -1;
        return {
            get: function (pos) {
                var lines = html.slice(lastMatchBegin + 1, pos).split('\n');
                parsedLinesCount += lines.length - 1;
                lastMatchBegin = pos;
                return parsedLinesCount + 1;
            }
        };
    }

    function Operators (isTruthy) {
        return {
            '==': function (l, r) { return l === r; },
            '!=': function (l, r) { return l !== r; },
            '>': function (l, r) { return l !== null && r !== null && l > r; },
            '<': function (l, r) { return l !== null && r !== null && l < r; },
            '>=': function (l, r) { return l !== null && r !== null && l >= r; },
            '<=': function (l, r) { return l !== null && r !== null && l <= r; },
            'contains': function (l, r) {
                if (!l)
                    return false;
                if (typeof l.indexOf !== 'function')
                    return false;
                return l.indexOf(r) > -1;
            },
            'and': function (l, r) { return isTruthy(l) && isTruthy(r); },
            'or': function (l, r) { return isTruthy(l) || isTruthy(r); }
        };
    }

    var operators$1 = Operators(isTruthy);
    function evalExp(exp, scope) {
        assert(scope, 'unable to evalExp: scope undefined');
        var operatorREs = operators;
        var match;
        for (var i = 0; i < operatorREs.length; i++) {
            var operatorRE = operatorREs[i];
            var expRE = new RegExp("^(" + quoteBalanced.source + ")(" + operatorRE.source + ")(" + quoteBalanced.source + ")$");
            if ((match = exp.match(expRE))) {
                var l = evalExp(match[1], scope);
                var op = operators$1[match[2].trim()];
                var r = evalExp(match[3], scope);
                return op(l, r);
            }
        }
        if ((match = exp.match(rangeLine))) {
            var low = evalValue(match[1], scope);
            var high = evalValue(match[2], scope);
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
        if (!str)
            return undefined;
        if (isLiteral(str)) {
            return parseLiteral(str);
        }
        if (isVariable(str)) {
            return scope.get(str);
        }
        throw new TypeError("cannot eval '" + str + "' as value");
    }
    function isTruthy(val) {
        return !isFalsy(val);
    }
    function isFalsy(val) {
        return val === false || undefined === val || val === null;
    }

    var render = {
        renderTemplates: function (templates, scope) {
            return __awaiter(this, void 0, void 0, function () {
                function renderTemplate(template) {
                    return __awaiter(this, void 0, void 0, function () {
                        var partial;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(template.type === 'tag')) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.renderTag(template, scope)];
                                case 1:
                                    partial = _a.sent();
                                    return [2 /*return*/, partial === undefined ? '' : partial];
                                case 2:
                                    if (template.type === 'value') {
                                        return [2 /*return*/, this.renderValue(template, scope)];
                                    }
                                    return [2 /*return*/, template.value];
                            }
                        });
                    });
                }
                var html, _i, templates_1, tpl, _a, e_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            assert(scope, 'unable to evalTemplates: scope undefined');
                            html = '';
                            _i = 0, templates_1 = templates;
                            _b.label = 1;
                        case 1:
                            if (!(_i < templates_1.length)) return [3 /*break*/, 6];
                            tpl = templates_1[_i];
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 4, , 5]);
                            _a = html;
                            return [4 /*yield*/, renderTemplate.call(this, tpl)];
                        case 3:
                            html = _a + _b.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            e_1 = _b.sent();
                            if (e_1 instanceof RenderBreakError) {
                                e_1.resolvedHTML = html;
                                throw e_1;
                            }
                            throw e_1 instanceof RenderError ? e_1 : new RenderError(e_1, tpl);
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6: return [2 /*return*/, html];
                    }
                });
            });
        },
        renderTag: function (template, scope) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (template.name === 'continue') {
                        throw new RenderBreakError('continue');
                    }
                    if (template.name === 'break') {
                        throw new RenderBreakError('break');
                    }
                    return [2 /*return*/, template.render(scope)];
                });
            });
        },
        renderValue: function (template, scope) {
            return __awaiter(this, void 0, void 0, function () {
                var partial;
                return __generator(this, function (_a) {
                    partial = this.evalValue(template, scope);
                    return [2 /*return*/, partial === undefined ? '' : stringify(partial)];
                });
            });
        },
        evalValue: function (template, scope) {
            assert(scope, 'unable to evalValue: scope undefined');
            return template.filters.reduce(function (prev, filter) { return filter.render(prev, scope); }, evalExp(template.initial, scope));
        }
    };
    function Render () {
        var instance = create(render);
        return instance;
    }

    function hash$1(markup, scope) {
        var obj = {};
        var match;
        hashCapture.lastIndex = 0;
        while ((match = hashCapture.exec(markup))) {
            var k = match[1];
            var v = match[2];
            obj[k] = evalValue(v, scope);
        }
        return obj;
    }
    function Tag () {
        var tagImpls = {};
        var _tagInstance = {
            render: function (scope) {
                return __awaiter(this, void 0, void 0, function () {
                    var obj, impl;
                    return __generator(this, function (_a) {
                        obj = hash$1(this.token.args, scope);
                        impl = this.tagImpl;
                        if (typeof impl.render !== 'function') {
                            return [2 /*return*/, ''];
                        }
                        return [2 /*return*/, impl.render(scope, obj)];
                    });
                });
            },
            parse: function (token, tokens) {
                this.type = 'tag';
                this.token = token;
                this.name = token.name;
                var tagImpl = tagImpls[this.name];
                assert(tagImpl, "tag " + this.name + " not found");
                this.tagImpl = create(tagImpl);
                if (this.tagImpl.parse) {
                    this.tagImpl.parse(token, tokens);
                }
            }
        };
        function register(name, tag) {
            tagImpls[name] = tag;
        }
        function construct(token, tokens) {
            var instance = create(_tagInstance);
            instance.parse(token, tokens);
            return instance;
        }
        function clear() {
            tagImpls = {};
        }
        return {
            construct: construct,
            register: register,
            clear: clear
        };
    }

    var valueRE = new RegExp("" + value.source, 'g');
    function Filter (options) {
        options = assign({}, options);
        var filters = {};
        var _filterInstance = {
            render: function (output, scope) {
                var args = this.args.map(function (arg) { return evalValue(arg, scope); });
                args.unshift(output);
                return this.filter.apply(null, args);
            },
            parse: function (str) {
                var match = filterLine.exec(str);
                assert(match, 'illegal filter: ' + str);
                var name = match[1];
                var argList = match[2] || '';
                var filter$$1 = filters[name];
                if (typeof filter$$1 !== 'function') {
                    if (options.strict_filters) {
                        throw new TypeError("undefined filter: " + name);
                    }
                    this.name = name;
                    this.filter = function (x) { return x; };
                    this.args = [];
                    return this;
                }
                var args = [];
                while ((match = valueRE.exec(argList.trim()))) {
                    var v = match[0];
                    var re = new RegExp(v + "\\s*:", 'g');
                    var keyMatch = re.exec(match.input);
                    var currentMatchIsKey = keyMatch && keyMatch.index === match.index;
                    currentMatchIsKey ? args.push("'" + v + "'") : args.push(v);
                }
                this.name = name;
                this.filter = filter$$1;
                this.args = args;
                return this;
            }
        };
        function construct(str) {
            var instance = create(_filterInstance);
            return instance.parse(str);
        }
        function register(name, filter$$1) {
            filters[name] = filter$$1;
        }
        function clear() {
            filters = {};
        }
        return {
            construct: construct, register: register, clear: clear
        };
    }

    function Parser (Tag, Filter) {
        var ParseStream = /** @class */ (function () {
            function ParseStream(tokens) {
                this.tokens = tokens;
                this.handlers = {};
            }
            ParseStream.prototype.on = function (name, cb) {
                this.handlers[name] = cb;
                return this;
            };
            ParseStream.prototype.trigger = function (event, arg) {
                var h = this.handlers[event];
                if (typeof h === 'function') {
                    h(arg);
                    return true;
                }
            };
            ParseStream.prototype.start = function () {
                this.trigger('start');
                var token;
                while (!this.stopRequested && (token = this.tokens.shift())) {
                    if (this.trigger('token', token))
                        continue;
                    if (token.type === 'tag' &&
                        this.trigger("tag:" + token.name, token)) {
                        continue;
                    }
                    var template = parseToken(token, this.tokens);
                    this.trigger('template', template);
                }
                if (!this.stopRequested)
                    this.trigger('end');
                return this;
            };
            ParseStream.prototype.stop = function () {
                this.stopRequested = true;
                return this;
            };
            return ParseStream;
        }());
        function parse(tokens) {
            var token;
            var templates = [];
            while ((token = tokens.shift())) {
                templates.push(parseToken(token, tokens));
            }
            return templates;
        }
        function parseToken(token, tokens) {
            try {
                var tpl = null;
                if (token.type === 'tag') {
                    tpl = parseTag(token, tokens);
                }
                else if (token.type === 'value') {
                    tpl = parseValue(token.value);
                }
                else { // token.type === 'html'
                    tpl = token;
                }
                tpl.token = token;
                return tpl;
            }
            catch (e) {
                throw new ParseError(e, token);
            }
        }
        function parseTag(token, tokens) {
            if (token.name === 'continue' || token.name === 'break')
                return token;
            return Tag.construct(token, tokens);
        }
        function parseValue(str) {
            var match = matchValue(str);
            assert(match, "illegal value string: " + str);
            var initial = match[0];
            str = str.substr(match.index + match[0].length);
            var filters = [];
            while ((match = filter.exec(str))) {
                filters.push([match[0].trim()]);
            }
            return {
                type: 'value',
                initial: initial,
                filters: filters.map(function (str) { return Filter.construct(str); })
            };
        }
        function parseStream(tokens) {
            return new ParseStream(tokens);
        }
        return {
            parse: parse,
            parseTag: parseTag,
            parseStream: parseStream,
            parseValue: parseValue
        };
    }

    /*
     * Call functions in serial until someone resolved.
     * @param {Array} iterable the array to iterate with.
     * @param {Array} iteratee returns a new promise.
     * The iteratee is invoked with three arguments: (value, index, iterable).
     */
    /*
     * Call functions in serial until someone rejected.
     * @param {Array} iterable the array to iterate with.
     * @param {Array} iteratee returns a new promise.
     * The iteratee is invoked with three arguments: (value, index, iterable).
     */
    function mapSeries(iterable, iteratee) {
        var ret = Promise.resolve('init');
        var result = [];
        iterable.forEach(function (item, idx) {
            ret = ret
                .then(function () { return iteratee(item, idx, iterable); })
                .then(function (x) { return result.push(x); });
        });
        return ret.then(function () { return result; });
    }

    function For (liquid, Liquid) {
        var RenderBreakError = Liquid.Types.RenderBreakError;
        var re = new RegExp("^(" + identifier.source + ")\\s+in\\s+" +
            ("(" + value.source + ")") +
            ("(?:\\s+" + hash.source + ")*") +
            "(?:\\s+(reversed))?" +
            ("(?:\\s+" + hash.source + ")*$"));
        liquid.registerTag('for', { parse: parse, render: render });
        function parse(tagToken, remainTokens) {
            var _this = this;
            var match = re.exec(tagToken.args);
            assert(match, "illegal tag: " + tagToken.raw);
            this.variable = match[1];
            this.collection = match[2];
            this.reversed = !!match[3];
            this.templates = [];
            this.elseTemplates = [];
            var p;
            var stream = liquid.parser.parseStream(remainTokens)
                .on('start', function () { return (p = _this.templates); })
                .on('tag:else', function () { return (p = _this.elseTemplates); })
                .on('tag:endfor', function () { return stream.stop(); })
                .on('template', function (tpl) { return p.push(tpl); })
                .on('end', function () {
                throw new Error("tag " + tagToken.raw + " not closed");
            });
            stream.start();
        }
        function render(scope, hash$$1) {
            return __awaiter(this, void 0, void 0, function () {
                var collection, offset, limit, contexts, html, finished;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            collection = Liquid.evalExp(this.collection, scope);
                            if (!isArray(collection)) {
                                if (isString(collection) && collection.length > 0) {
                                    collection = [collection];
                                }
                                else if (isObject(collection)) {
                                    collection = Object.keys(collection).map(function (key) { return [key, collection[key]]; });
                                }
                            }
                            if (!isArray(collection) || !collection.length) {
                                return [2 /*return*/, liquid.renderer.renderTemplates(this.elseTemplates, scope)];
                            }
                            offset = hash$$1.offset || 0;
                            limit = (hash$$1.limit === undefined) ? collection.length : hash$$1.limit;
                            collection = collection.slice(offset, offset + limit);
                            if (this.reversed)
                                collection.reverse();
                            contexts = collection.map(function (item, i) {
                                var ctx = {};
                                ctx[_this.variable] = item;
                                ctx.forloop = {
                                    first: i === 0,
                                    index: i + 1,
                                    index0: i,
                                    last: i === collection.length - 1,
                                    length: collection.length,
                                    rindex: collection.length - i,
                                    rindex0: collection.length - i - 1
                                };
                                return ctx;
                            });
                            html = '';
                            finished = false;
                            return [4 /*yield*/, mapSeries(contexts, function (context) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a, e_1;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                if (finished)
                                                    return [2 /*return*/];
                                                scope.push(context);
                                                _b.label = 1;
                                            case 1:
                                                _b.trys.push([1, 3, , 4]);
                                                _a = html;
                                                return [4 /*yield*/, liquid.renderer.renderTemplates(this.templates, scope)];
                                            case 2:
                                                html = _a + _b.sent();
                                                return [3 /*break*/, 4];
                                            case 3:
                                                e_1 = _b.sent();
                                                if (e_1 instanceof RenderBreakError) {
                                                    html += e_1.resolvedHTML;
                                                    if (e_1.message === 'break') {
                                                        finished = true;
                                                    }
                                                }
                                                else
                                                    throw e_1;
                                                return [3 /*break*/, 4];
                                            case 4:
                                                scope.pop(context);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, html];
                    }
                });
            });
        }
    }

    function Assign (liquid, Liquid) {
        var re = new RegExp("(" + identifier.source + ")\\s*=([^]*)");
        var AssignScope = Liquid.Types.AssignScope;
        liquid.registerTag('assign', {
            parse: function (token) {
                var match = token.args.match(re);
                assert(match, "illegal token " + token.raw);
                this.key = match[1];
                this.value = match[2];
            },
            render: function (scope) {
                var ctx = create(AssignScope);
                ctx[this.key] = liquid.evalValue(this.value, scope);
                scope.push(ctx);
                return Promise.resolve('');
            }
        });
    }

    function Capture (liquid, Liquid) {
        var re = new RegExp("(" + identifier.source + ")");
        var CaptureScope = Liquid.Types.CaptureScope;
        liquid.registerTag('capture', {
            parse: function (tagToken, remainTokens) {
                var _this = this;
                var match = tagToken.args.match(re);
                assert(match, tagToken.args + " not valid identifier");
                this.variable = match[1];
                this.templates = [];
                var stream = liquid.parser.parseStream(remainTokens);
                stream.on('tag:endcapture', function (token) { return stream.stop(); })
                    .on('template', function (tpl) { return _this.templates.push(tpl); })
                    .on('end', function (x) {
                    throw new Error("tag " + tagToken.raw + " not closed");
                });
                stream.start();
            },
            render: function (scope, hash$$1) {
                return __awaiter(this, void 0, void 0, function () {
                    var html, ctx;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, liquid.renderer.renderTemplates(this.templates, scope)];
                            case 1:
                                html = _a.sent();
                                ctx = create(CaptureScope);
                                ctx[this.variable] = html;
                                scope.push(ctx);
                                return [2 /*return*/];
                        }
                    });
                });
            }
        });
    }

    function Case (liquid, Liquid) {
        liquid.registerTag('case', {
            parse: function (tagToken, remainTokens) {
                var _this = this;
                this.cond = tagToken.args;
                this.cases = [];
                this.elseTemplates = [];
                var p = [];
                var stream = liquid.parser.parseStream(remainTokens)
                    .on('tag:when', function (token) {
                    _this.cases.push({
                        val: token.args,
                        templates: p = []
                    });
                })
                    .on('tag:else', function () { return (p = _this.elseTemplates); })
                    .on('tag:endcase', function (token) { return stream.stop(); })
                    .on('template', function (tpl) { return p.push(tpl); })
                    .on('end', function (x) {
                    throw new Error("tag " + tagToken.raw + " not closed");
                });
                stream.start();
            },
            render: function (scope, hash) {
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
    }

    function Comment (liquid) {
        liquid.registerTag('comment', {
            parse: function (tagToken, remainTokens) {
                var stream = liquid.parser.parseStream(remainTokens);
                stream
                    .on('token', function (token) {
                    if (token.name === 'endcomment')
                        stream.stop();
                })
                    .on('end', function (x) {
                    throw new Error("tag " + tagToken.raw + " not closed");
                });
                stream.start();
            }
        });
    }

    var staticFileRE = /[^\s,]+/;
    function Include (liquid, Liquid) {
        var withRE = new RegExp("with\\s+(" + value.source + ")");
        liquid.registerTag('include', {
            parse: function (token) {
                var match = staticFileRE.exec(token.args);
                if (match) {
                    this.staticValue = match[0];
                }
                match = value.exec(token.args);
                if (match) {
                    this.value = match[0];
                }
                match = withRE.exec(token.args);
                if (match) {
                    this.with = match[1];
                }
            },
            render: function (scope, hash$$1) {
                return __awaiter(this, void 0, void 0, function () {
                    var filepath, template, originBlocks, originBlockMode, templates, html;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!scope.opts.dynamicPartials) return [3 /*break*/, 4];
                                if (!quotedLine.exec(this.value)) return [3 /*break*/, 2];
                                template = this.value.slice(1, -1);
                                return [4 /*yield*/, liquid.parseAndRender(template, scope.getAll(), scope.opts)];
                            case 1:
                                filepath = _a.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                filepath = Liquid.evalValue(this.value, scope);
                                _a.label = 3;
                            case 3: return [3 /*break*/, 5];
                            case 4:
                                filepath = this.staticValue;
                                _a.label = 5;
                            case 5:
                                assert(filepath, "cannot include with empty filename");
                                originBlocks = scope.opts.blocks;
                                originBlockMode = scope.opts.blockMode;
                                scope.opts.blocks = {};
                                scope.opts.blockMode = 'output';
                                if (this.with) {
                                    hash$$1[filepath] = Liquid.evalValue(this.with, scope);
                                }
                                return [4 /*yield*/, liquid.getTemplate(filepath, scope.opts.root)];
                            case 6:
                                templates = _a.sent();
                                scope.push(hash$$1);
                                return [4 /*yield*/, liquid.renderer.renderTemplates(templates, scope)];
                            case 7:
                                html = _a.sent();
                                scope.pop(hash$$1);
                                scope.opts.blocks = originBlocks;
                                scope.opts.blockMode = originBlockMode;
                                return [2 /*return*/, html];
                        }
                    });
                });
            }
        });
    }

    function Decrement (liquid, Liquid) {
        var _a = Liquid.Types, CaptureScope = _a.CaptureScope, AssignScope = _a.AssignScope, DecrementScope = _a.DecrementScope;
        liquid.registerTag('decrement', {
            parse: function (token) {
                var match = token.args.match(identifier);
                assert(match, "illegal identifier " + token.args);
                this.variable = match[0];
            },
            render: function (scope, hash$$1) {
                var context = scope.findContextFor(this.variable, function (ctx) {
                    var proto = Object.getPrototypeOf(ctx);
                    return proto !== CaptureScope && proto !== AssignScope;
                });
                if (!context) {
                    context = create(DecrementScope);
                    scope.unshift(context);
                }
                if (typeof context[this.variable] !== 'number') {
                    context[this.variable] = 0;
                }
                return --context[this.variable];
            }
        });
    }

    function Cycle (liquid, Liquid) {
        var groupRE = new RegExp("^(?:(" + value.source + ")\\s*:\\s*)?(.*)$");
        var candidatesRE = new RegExp(value.source, 'g');
        liquid.registerTag('cycle', {
            parse: function (tagToken, remainTokens) {
                var match = groupRE.exec(tagToken.args);
                assert(match, "illegal tag: " + tagToken.raw);
                this.group = match[1] || '';
                var candidates = match[2];
                this.candidates = [];
                while ((match = candidatesRE.exec(candidates))) {
                    this.candidates.push(match[0]);
                }
                assert(this.candidates.length, "empty candidates: " + tagToken.raw);
            },
            render: function (scope, hash$$1) {
                var group = Liquid.evalValue(this.group, scope);
                var fingerprint = "cycle:" + group + ":" + this.candidates.join(',');
                var groups = scope.opts.groups = scope.opts.groups || {};
                var idx = groups[fingerprint];
                if (idx === undefined) {
                    idx = groups[fingerprint] = 0;
                }
                var candidate = this.candidates[idx];
                idx = (idx + 1) % this.candidates.length;
                groups[fingerprint] = idx;
                return Liquid.evalValue(candidate, scope);
            }
        });
    }

    function If (liquid, Liquid) {
        liquid.registerTag('if', {
            parse: function (tagToken, remainTokens) {
                var _this = this;
                this.branches = [];
                this.elseTemplates = [];
                var p;
                var stream = liquid.parser.parseStream(remainTokens)
                    .on('start', function () { return _this.branches.push({
                    cond: tagToken.args,
                    templates: (p = [])
                }); })
                    .on('tag:elsif', function (token) {
                    _this.branches.push({
                        cond: token.args,
                        templates: p = []
                    });
                })
                    .on('tag:else', function () { return (p = _this.elseTemplates); })
                    .on('tag:endif', function (token) { return stream.stop(); })
                    .on('template', function (tpl) { return p.push(tpl); })
                    .on('end', function (x) {
                    throw new Error("tag " + tagToken.raw + " not closed");
                });
                stream.start();
            },
            render: function (scope, hash) {
                for (var _i = 0, _a = this.branches; _i < _a.length; _i++) {
                    var branch = _a[_i];
                    var cond = Liquid.evalExp(branch.cond, scope);
                    if (Liquid.isTruthy(cond)) {
                        return liquid.renderer.renderTemplates(branch.templates, scope);
                    }
                }
                return liquid.renderer.renderTemplates(this.elseTemplates, scope);
            }
        });
    }

    function Increment (liquid, Liquid) {
        var _a = Liquid.Types, CaptureScope = _a.CaptureScope, AssignScope = _a.AssignScope, IncrementScope = _a.IncrementScope;
        liquid.registerTag('increment', {
            parse: function (token) {
                var match = token.args.match(identifier);
                assert(match, "illegal identifier " + token.args);
                this.variable = match[0];
            },
            render: function (scope, hash$$1) {
                var context = scope.findContextFor(this.variable, function (ctx) {
                    var proto = Object.getPrototypeOf(ctx);
                    return proto !== CaptureScope && proto !== AssignScope;
                });
                if (!context) {
                    context = create(IncrementScope);
                    scope.unshift(context);
                }
                if (typeof context[this.variable] !== 'number') {
                    context[this.variable] = 0;
                }
                var val = context[this.variable];
                context[this.variable]++;
                return val;
            }
        });
    }

    /*
     * blockMode:
     * * "store": store rendered html into blocks
     * * "output": output rendered html
     */
    function Layout (liquid, Liquid) {
        var staticFileRE = /\S+/;
        liquid.registerTag('layout', {
            parse: function (token, remainTokens) {
                var match = staticFileRE.exec(token.args);
                if (match) {
                    this.staticLayout = match[0];
                }
                match = value.exec(token.args);
                if (match) {
                    this.layout = match[0];
                }
                this.tpls = liquid.parser.parse(remainTokens);
            },
            render: function (scope, hash$$1) {
                return __awaiter(this, void 0, void 0, function () {
                    var layout, html, templates, partial;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                layout = scope.opts.dynamicPartials
                                    ? Liquid.evalValue(this.layout, scope)
                                    : this.staticLayout;
                                assert(layout, "cannot apply layout with empty filename");
                                // render the remaining tokens immediately
                                scope.opts.blockMode = 'store';
                                return [4 /*yield*/, liquid.renderer.renderTemplates(this.tpls, scope)];
                            case 1:
                                html = _a.sent();
                                if (scope.opts.blocks[''] === undefined) {
                                    scope.opts.blocks[''] = html;
                                }
                                return [4 /*yield*/, liquid.getTemplate(layout, scope.opts.root)];
                            case 2:
                                templates = _a.sent();
                                scope.push(hash$$1);
                                scope.opts.blockMode = 'output';
                                return [4 /*yield*/, liquid.renderer.renderTemplates(templates, scope)];
                            case 3:
                                partial = _a.sent();
                                scope.pop(hash$$1);
                                return [2 /*return*/, partial];
                        }
                    });
                });
            }
        });
        liquid.registerTag('block', {
            parse: function (token, remainTokens) {
                var _this = this;
                var match = /\w+/.exec(token.args);
                this.block = match ? match[0] : '';
                this.tpls = [];
                var stream = liquid.parser.parseStream(remainTokens)
                    .on('tag:endblock', function () { return stream.stop(); })
                    .on('template', function (tpl) { return _this.tpls.push(tpl); })
                    .on('end', function () {
                    throw new Error("tag " + token.raw + " not closed");
                });
                stream.start();
            },
            render: function (scope) {
                return __awaiter(this, void 0, void 0, function () {
                    var childDefined, html, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                childDefined = scope.opts.blocks[this.block];
                                if (!(childDefined !== undefined)) return [3 /*break*/, 1];
                                _a = childDefined;
                                return [3 /*break*/, 3];
                            case 1: return [4 /*yield*/, liquid.renderer.renderTemplates(this.tpls, scope)];
                            case 2:
                                _a = _b.sent();
                                _b.label = 3;
                            case 3:
                                html = _a;
                                if (scope.opts.blockMode === 'store') {
                                    scope.opts.blocks[this.block] = html;
                                    return [2 /*return*/, ''];
                                }
                                return [2 /*return*/, html];
                        }
                    });
                });
            }
        });
    }

    function Raw (liquid) {
        liquid.registerTag('raw', {
            parse: function (tagToken, remainTokens) {
                var _this = this;
                this.tokens = [];
                var stream = liquid.parser.parseStream(remainTokens);
                stream
                    .on('token', function (token) {
                    if (token.name === 'endraw')
                        stream.stop();
                    else
                        _this.tokens.push(token);
                })
                    .on('end', function () {
                    throw new Error("tag " + tagToken.raw + " not closed");
                });
                stream.start();
            },
            render: function (scope, hash) {
                return this.tokens.map(function (token) { return token.raw; }).join('');
            }
        });
    }

    function Tablerow (liquid, Liquid) {
        var re = new RegExp("^(" + identifier.source + ")\\s+in\\s+" +
            ("(" + value.source + ")") +
            ("(?:\\s+" + hash.source + ")*$"));
        liquid.registerTag('tablerow', {
            parse: function (tagToken, remainTokens) {
                var _this = this;
                var match = re.exec(tagToken.args);
                assert(match, "illegal tag: " + tagToken.raw);
                this.variable = match[1];
                this.collection = match[2];
                this.templates = [];
                var p;
                var stream = liquid.parser.parseStream(remainTokens)
                    .on('start', function () { return (p = _this.templates); })
                    .on('tag:endtablerow', function (token) { return stream.stop(); })
                    .on('template', function (tpl) { return p.push(tpl); })
                    .on('end', function () {
                    throw new Error("tag " + tagToken.raw + " not closed");
                });
                stream.start();
            },
            render: function (scope, hash$$1) {
                return __awaiter(this, void 0, void 0, function () {
                    var collection, offset, limit, cols, contexts, row, html;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                collection = Liquid.evalExp(this.collection, scope) || [];
                                offset = hash$$1.offset || 0;
                                limit = (hash$$1.limit === undefined) ? collection.length : hash$$1.limit;
                                collection = collection.slice(offset, offset + limit);
                                cols = hash$$1.cols || collection.length;
                                contexts = collection.map(function (item, i) {
                                    var ctx = {};
                                    ctx[_this.variable] = item;
                                    return ctx;
                                });
                                html = '';
                                return [4 /*yield*/, mapSeries(contexts, function (context, idx) { return __awaiter(_this, void 0, void 0, function () {
                                        var col, _a;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    row = Math.floor(idx / cols) + 1;
                                                    col = (idx % cols) + 1;
                                                    if (col === 1) {
                                                        if (row !== 1) {
                                                            html += '</tr>';
                                                        }
                                                        html += "<tr class=\"row" + row + "\">";
                                                    }
                                                    html += "<td class=\"col" + col + "\">";
                                                    scope.push(context);
                                                    _a = html;
                                                    return [4 /*yield*/, liquid.renderer.renderTemplates(this.templates, scope)];
                                                case 1:
                                                    html = _a + _b.sent();
                                                    html += '</td>';
                                                    scope.pop(context);
                                                    return [2 /*return*/, html];
                                            }
                                        });
                                    }); })];
                            case 1:
                                _a.sent();
                                if (row > 0) {
                                    html += '</tr>';
                                }
                                return [2 /*return*/, html];
                        }
                    });
                });
            }
        });
    }

    function Unless (liquid, Liquid) {
        liquid.registerTag('unless', {
            parse: function (tagToken, remainTokens) {
                var _this = this;
                this.templates = [];
                this.elseTemplates = [];
                var p;
                var stream = liquid.parser.parseStream(remainTokens)
                    .on('start', function (x) {
                    p = _this.templates;
                    _this.cond = tagToken.args;
                })
                    .on('tag:else', function () { return (p = _this.elseTemplates); })
                    .on('tag:endunless', function (token) { return stream.stop(); })
                    .on('template', function (tpl) { return p.push(tpl); })
                    .on('end', function (x) {
                    throw new Error("tag " + tagToken.raw + " not closed");
                });
                stream.start();
            },
            render: function (scope, hash) {
                var cond = Liquid.evalExp(this.cond, scope);
                return Liquid.isFalsy(cond)
                    ? liquid.renderer.renderTemplates(this.templates, scope)
                    : liquid.renderer.renderTemplates(this.elseTemplates, scope);
            }
        });
    }

    function tags (engine, Liquid) {
        Assign(engine, Liquid);
        Capture(engine, Liquid);
        Case(engine, Liquid);
        Comment(engine, Liquid);
        Cycle(engine, Liquid);
        Decrement(engine, Liquid);
        For(engine, Liquid);
        If(engine, Liquid);
        Include(engine, Liquid);
        Increment(engine, Liquid);
        Layout(engine, Liquid);
        Raw(engine, Liquid);
        Tablerow(engine, Liquid);
        Unless(engine, Liquid);
    }

    var monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];
    var dayNames = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    var monthNamesShort = monthNames.map(abbr);
    var dayNamesShort = dayNames.map(abbr);
    var suffixes = {
        1: 'st',
        2: 'nd',
        3: 'rd',
        'default': 'th'
    };
    function abbr(str) {
        return str.slice(0, 3);
    }
    // prototype extensions
    var _date = {
        daysInMonth: function (d) {
            var feb = _date.isLeapYear(d) ? 29 : 28;
            return [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        },
        getDayOfYear: function (d) {
            var num = 0;
            for (var i = 0; i < d.getMonth(); ++i) {
                num += _date.daysInMonth(d)[i];
            }
            return num + d.getDate();
        },
        // Startday is an integer of which day to start the week measuring from
        // TODO: that comment was retarted. fix it.
        getWeekOfYear: function (d, startDay) {
            // Skip to startDay of this week
            var now = this.getDayOfYear(d) + (startDay - d.getDay());
            // Find the first startDay of the year
            var jan1 = new Date(d.getFullYear(), 0, 1);
            var then = (7 - jan1.getDay() + startDay);
            return _number.pad(Math.floor((now - then) / 7) + 1, 2);
        },
        isLeapYear: function (d) {
            var year = d.getFullYear();
            return !!((year & 3) === 0 && (year % 100 || (year % 400 === 0 && year)));
        },
        getSuffix: function (d) {
            var str = d.getDate().toString();
            var index = parseInt(str.slice(-1));
            return suffixes[index] || suffixes['default'];
        },
        century: function (d) {
            return parseInt(d.getFullYear().toString().substring(0, 2), 10);
        }
    };
    var _number = {
        pad: function (value, size, ch) {
            if (!ch)
                ch = '0';
            var result = value.toString();
            var pad = size - result.length;
            while (pad-- > 0) {
                result = ch + result;
            }
            return result;
        }
    };
    var formatCodes = {
        a: function (d) {
            return dayNamesShort[d.getDay()];
        },
        A: function (d) {
            return dayNames[d.getDay()];
        },
        b: function (d) {
            return monthNamesShort[d.getMonth()];
        },
        B: function (d) {
            return monthNames[d.getMonth()];
        },
        c: function (d) {
            return d.toLocaleString();
        },
        C: function (d) {
            return _date.century(d);
        },
        d: function (d) {
            return _number.pad(d.getDate(), 2);
        },
        e: function (d) {
            return _number.pad(d.getDate(), 2, ' ');
        },
        H: function (d) {
            return _number.pad(d.getHours(), 2);
        },
        I: function (d) {
            return _number.pad(d.getHours() % 12 || 12, 2);
        },
        j: function (d) {
            return _number.pad(_date.getDayOfYear(d), 3);
        },
        k: function (d) {
            return _number.pad(d.getHours(), 2, ' ');
        },
        l: function (d) {
            return _number.pad(d.getHours() % 12 || 12, 2, ' ');
        },
        L: function (d) {
            return _number.pad(d.getMilliseconds(), 3);
        },
        m: function (d) {
            return _number.pad(d.getMonth() + 1, 2);
        },
        M: function (d) {
            return _number.pad(d.getMinutes(), 2);
        },
        p: function (d) {
            return (d.getHours() < 12 ? 'AM' : 'PM');
        },
        P: function (d) {
            return (d.getHours() < 12 ? 'am' : 'pm');
        },
        q: function (d) {
            return _date.getSuffix(d);
        },
        s: function (d) {
            return Math.round(d.valueOf() / 1000);
        },
        S: function (d) {
            return _number.pad(d.getSeconds(), 2);
        },
        u: function (d) {
            return d.getDay() || 7;
        },
        U: function (d) {
            return _date.getWeekOfYear(d, 0);
        },
        w: function (d) {
            return d.getDay();
        },
        W: function (d) {
            return _date.getWeekOfYear(d, 1);
        },
        x: function (d) {
            return d.toLocaleDateString();
        },
        X: function (d) {
            return d.toLocaleTimeString();
        },
        y: function (d) {
            return d.getFullYear().toString().substring(2, 4);
        },
        Y: function (d) {
            return d.getFullYear();
        },
        z: function (d) {
            var tz = d.getTimezoneOffset() / 60 * 100;
            return (tz > 0 ? '-' : '+') + _number.pad(Math.abs(tz), 4);
        },
        '%': function () {
            return '%';
        }
    };
    formatCodes.h = formatCodes.b;
    formatCodes.N = formatCodes.L;
    function strftime (d, format) {
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
            var func = formatCodes[ch];
            output += func ? func.call(this, d) : '%' + ch;
        }
    }

    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&#34;',
        "'": '&#39;'
    };
    var unescapeMap = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&#34;': '"',
        '&#39;': "'"
    };
    var filters = {
        'abs': function (v) { return Math.abs(v); },
        'append': function (v, arg) { return v + arg; },
        'capitalize': function (str) { return stringify$1(str).charAt(0).toUpperCase() + str.slice(1); },
        'ceil': function (v) { return Math.ceil(v); },
        'concat': function (v, arg) { return Array.prototype.concat.call(v, arg); },
        'date': function (v, arg) {
            var date = v;
            if (v === 'now') {
                date = new Date();
            }
            else if (isString(v)) {
                date = new Date(v);
            }
            return isValidDate(date) ? strftime(date, arg) : v;
        },
        'default': function (v, arg) { return isTruthy(v) ? v : arg; },
        'divided_by': function (v, arg) { return v / arg; },
        'downcase': function (v) { return v.toLowerCase(); },
        'escape': escape,
        'escape_once': function (str) { return escape(unescape(str)); },
        'first': function (v) { return v[0]; },
        'floor': function (v) { return Math.floor(v); },
        'join': function (v, arg) { return v.join(arg === undefined ? ' ' : arg); },
        'last': function (v) { return last(v); },
        'lstrip': function (v) { return stringify$1(v).replace(/^\s+/, ''); },
        'map': function (arr, arg) { return arr.map(function (v) { return v[arg]; }); },
        'minus': bindFixed(function (v, arg) { return v - arg; }),
        'modulo': bindFixed(function (v, arg) { return v % arg; }),
        'newline_to_br': function (v) { return v.replace(/\n/g, '<br />'); },
        'plus': bindFixed(function (v, arg) { return Number(v) + Number(arg); }),
        'prepend': function (v, arg) { return arg + v; },
        'remove': function (v, arg) { return v.split(arg).join(''); },
        'remove_first': function (v, l) { return v.replace(l, ''); },
        'replace': function (v, pattern, replacement) {
            return stringify$1(v).split(pattern).join(replacement);
        },
        'replace_first': function (v, arg1, arg2) { return stringify$1(v).replace(arg1, arg2); },
        'reverse': function (v) { return v.reverse(); },
        'round': function (v, arg) {
            var amp = Math.pow(10, arg || 0);
            return Math.round(v * amp, arg) / amp;
        },
        'rstrip': function (str) { return stringify$1(str).replace(/\s+$/, ''); },
        'size': function (v) { return v.length; },
        'slice': function (v, begin, length) {
            if (length === undefined)
                length = 1;
            return v.slice(begin, begin + length);
        },
        'sort': function (v, arg) { return v.sort(arg); },
        'split': function (v, arg) { return stringify$1(v).split(arg); },
        'strip': function (v) { return stringify$1(v).trim(); },
        'strip_html': function (v) { return stringify$1(v).replace(/<script.*?<\/script>|<!--.*?-->|<style.*?<\/style>|<.*?>/g, ''); },
        'strip_newlines': function (v) { return stringify$1(v).replace(/\n/g, ''); },
        'times': function (v, arg) { return v * arg; },
        'truncate': function (v, l, o) {
            v = stringify$1(v);
            o = (o === undefined) ? '...' : o;
            l = l || 16;
            if (v.length <= l)
                return v;
            return v.substr(0, l - o.length) + o;
        },
        'truncatewords': function (v, l, o) {
            if (o === undefined)
                o = '...';
            var arr = v.split(' ');
            var ret = arr.slice(0, l).join(' ');
            if (arr.length > l)
                ret += o;
            return ret;
        },
        'uniq': function (arr) {
            var u = {};
            return (arr || []).filter(function (val) {
                if (u.hasOwnProperty(val)) {
                    return false;
                }
                u[val] = true;
                return true;
            });
        },
        'upcase': function (str) { return stringify$1(str).toUpperCase(); },
        'url_decode': function (x) { return x.split('+').map(decodeURIComponent).join(' '); },
        'url_encode': function (x) { return x.split(' ').map(encodeURIComponent).join('+'); }
    };
    function escape(str) {
        return stringify$1(str).replace(/&|<|>|"|'/g, function (m) { return escapeMap[m]; });
    }
    function unescape(str) {
        return stringify$1(str).replace(/&(amp|lt|gt|#34|#39);/g, function (m) { return unescapeMap[m]; });
    }
    function getFixed(v) {
        var p = (v + '').split('.');
        return (p.length > 1) ? p[1].length : 0;
    }
    function getMaxFixed(l, r) {
        return Math.max(getFixed(l), getFixed(r));
    }
    function stringify$1(obj) {
        return obj + '';
    }
    function bindFixed(cb) {
        return function (l, r) {
            var f = getMaxFixed(l, r);
            return cb(l, r).toFixed(f);
        };
    }
    function isValidDate(date) {
        return date instanceof Date && !isNaN(date.getTime());
    }
    function registerAll(liquid, Liquid) {
        return forOwn(filters, function (func, name) { return liquid.registerFilter(name, func); });
    }
    registerAll.filters = filters;

    var Liquid = /** @class */ (function () {
        function Liquid(options) {
            options = assign({
                root: ['.'],
                cache: false,
                extname: '',
                dynamicPartials: true,
                trim_tag_right: false,
                trim_tag_left: false,
                trim_value_right: false,
                trim_value_left: false,
                greedy: true,
                strict_filters: false,
                strict_variables: false
            }, options);
            options.root = normalizeStringArray(options.root);
            if (options.cache) {
                this.cache = {};
            }
            this.options = options;
            this.tags = Tag();
            this.filters = Filter(options);
            this.parser = Parser(this.tags, this.filters);
            this.renderer = Render();
            tags(this, Liquid);
            registerAll(this, Liquid);
        }
        Liquid.prototype.parse = function (html, filepath) {
            var tokens = parse(html, filepath, this.options);
            return this.parser.parse(tokens);
        };
        Liquid.prototype.render = function (tpl, ctx, opts) {
            opts = assign({}, this.options, opts);
            var scope = new Scope(ctx, opts);
            return this.renderer.renderTemplates(tpl, scope);
        };
        Liquid.prototype.parseAndRender = function (html, ctx, opts) {
            return __awaiter(this, void 0, void 0, function () {
                var tpl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.parse(html)];
                        case 1:
                            tpl = _a.sent();
                            return [2 /*return*/, this.render(tpl, ctx, opts)];
                    }
                });
            });
        };
        Liquid.prototype.getTemplate = function (file, root) {
            return __awaiter(this, void 0, void 0, function () {
                var filepath;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, resolve(file, root, this.options)];
                        case 1:
                            filepath = _a.sent();
                            return [2 /*return*/, this.respectCache(filepath, function () { return __awaiter(_this, void 0, void 0, function () {
                                    var str;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, read(filepath)];
                                            case 1:
                                                str = _a.sent();
                                                return [2 /*return*/, this.parse(str, filepath)];
                                        }
                                    });
                                }); })];
                    }
                });
            });
        };
        Liquid.prototype.renderFile = function (file, ctx, opts) {
            return __awaiter(this, void 0, void 0, function () {
                var templates;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            opts = assign({}, opts);
                            return [4 /*yield*/, this.getTemplate(file, opts.root)];
                        case 1:
                            templates = _a.sent();
                            return [2 /*return*/, this.render(templates, ctx, opts)];
                    }
                });
            });
        };
        Liquid.prototype.respectCache = function (key, getter) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheEnabled, value;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheEnabled = this.options.cache;
                            if (cacheEnabled && this.cache[key]) {
                                return [2 /*return*/, this.cache[key]];
                            }
                            return [4 /*yield*/, getter()];
                        case 1:
                            value = _a.sent();
                            if (cacheEnabled) {
                                this.cache[key] = value;
                            }
                            return [2 /*return*/, value];
                    }
                });
            });
        };
        Liquid.prototype.evalValue = function (str, scope) {
            var tpl = this.parser.parseValue(str.trim());
            return this.renderer.evalValue(tpl, scope);
        };
        Liquid.prototype.registerFilter = function (name, filter) {
            return this.filters.register(name, filter);
        };
        Liquid.prototype.registerTag = function (name, tag) {
            return this.tags.register(name, tag);
        };
        Liquid.prototype.plugin = function (plugin) {
            return plugin.call(this, Liquid);
        };
        Liquid.prototype.express = function (opts) {
            opts = opts || {};
            var self = this;
            return function (filePath, ctx, cb) {
                assert(isArray(this.root) || isString(this.root), 'illegal views root, are you using express.js?');
                opts.root = this.root;
                self.renderFile(filePath, ctx, opts).then(function (html) { return cb(null, html); }, cb);
            };
        };
        Liquid.default = Liquid;
        Liquid.isTruthy = isTruthy;
        Liquid.isFalsy = isFalsy;
        Liquid.evalExp = evalExp;
        Liquid.evalValue = evalValue;
        Liquid.Types = {
            ParseError: ParseError,
            TokenizationError: TokenizationError,
            RenderBreakError: RenderBreakError,
            AssertionError: AssertionError,
            AssignScope: {},
            CaptureScope: {},
            IncrementScope: {},
            DecrementScope: {}
        };
        return Liquid;
    }());
    function normalizeStringArray(value) {
        if (isArray(value))
            return value;
        if (isString(value))
            return [value];
        throw new TypeError('illegal root: ' + value);
    }

    return Liquid;

}));
//# sourceMappingURL=liquid.js.map
