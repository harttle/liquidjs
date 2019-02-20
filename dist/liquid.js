/*
 * liquidjs@7.0.2, https://github.com/harttle/liquidjs
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

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

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
            return '';
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
        return target;
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
    function padStart(str, length, ch) {
        if (ch === void 0) { ch = ' '; }
        str = String(str);
        var n = length - str.length;
        while (n-- > 0)
            str = ch + str;
        return str;
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
    var tagLine = new RegExp("^\\s*(" + identifier.source + ")\\s*([\\s\\S]*?)\\s*$");
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
            this.stack = this.message + '\n' + context +
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
            _this.message = err.message;
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
            _this.message = err.message;
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
            var num = padStart(String(lineNumber), String(end).length);
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

    function assert (predicate, message) {
        if (!predicate) {
            message = message || "expect " + predicate + " to be true";
            throw new AssertionError(message);
        }
    }

    var defaultOptions = {
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
    };
    function normalize(options) {
        options = options || {};
        if (options.hasOwnProperty('root')) {
            options.root = normalizeStringArray(options.root);
        }
        return options;
    }
    function normalizeStringArray(value) {
        if (isArray(value))
            return value;
        if (isString(value))
            return [value];
        return [];
    }

    var BlockMode;
    (function (BlockMode) {
        /* store rendered html into blocks */
        BlockMode[BlockMode["OUTPUT"] = 0] = "OUTPUT";
        /* output rendered html directly */
        BlockMode[BlockMode["STORE"] = 1] = "STORE";
    })(BlockMode || (BlockMode = {}));
    var BlockMode$1 = BlockMode;

    var Scope = /** @class */ (function () {
        function Scope(ctx, opts) {
            if (ctx === void 0) { ctx = {}; }
            if (opts === void 0) { opts = defaultOptions; }
            this.blocks = {};
            this.blockMode = BlockMode$1.OUTPUT;
            this.opts = __assign({}, defaultOptions, opts);
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
            if (filter$$1 === void 0) { filter$$1 = function () { return true; }; }
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

    var CaptureScope = /** @class */ (function () {
        function CaptureScope() {
        }
        return CaptureScope;
    }());
    var AssignScope = /** @class */ (function () {
        function AssignScope() {
        }
        return AssignScope;
    }());
    var IncrementScope = /** @class */ (function () {
        function IncrementScope() {
        }
        return IncrementScope;
    }());
    var DecrementScope = /** @class */ (function () {
        function DecrementScope() {
        }
        return DecrementScope;
    }());



    var Types = /*#__PURE__*/Object.freeze({
        AssignScope: AssignScope,
        CaptureScope: CaptureScope,
        IncrementScope: IncrementScope,
        DecrementScope: DecrementScope,
        ParseError: ParseError,
        TokenizationError: TokenizationError,
        RenderBreakError: RenderBreakError,
        AssertionError: AssertionError
    });

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
    function resolve(root, filepath, ext) {
        if (root.length && last(root) !== '/')
            root += '/';
        var url = domResolve(root, filepath);
        return url.replace(/^(\w+:\/\/[^/]+)(\/[^?]+)/, function (str, origin, path) {
            var last$$1 = path.split('/').pop();
            if (/\.\w+$/.test(last$$1))
                return str;
            return origin + path + ext;
        });
    }
    function readFile(url) {
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
    function exists() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true];
            });
        });
    }
    var fs = { readFile: readFile, resolve: resolve, exists: exists };

    function whiteSpaceCtrl(tokens, options) {
        options = __assign({ greedy: true }, options);
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
            return token.trimLeft || options.trim_tag_left;
        if (token.type === 'output')
            return token.trimLeft || options.trim_value_left;
    }
    function shouldTrimRight(token, inRaw, options) {
        if (inRaw)
            return false;
        if (token.type === 'tag')
            return token.trimRight || options.trim_tag_right;
        if (token.type === 'output')
            return token.trimRight || options.trim_value_right;
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

    var Token = /** @class */ (function () {
        function Token(raw, pos, input, file, line) {
            this.line = line;
            this.raw = raw;
            this.input = input;
            this.file = file;
        }
        return Token;
    }());

    var HTMLToken = /** @class */ (function (_super) {
        __extends(HTMLToken, _super);
        function HTMLToken(str, begin, input, file, line) {
            var _this = _super.call(this, str, begin, input, file, line) || this;
            _this.type = 'html';
            _this.value = str;
            return _this;
        }
        return HTMLToken;
    }(Token));

    var DelimitedToken = /** @class */ (function (_super) {
        __extends(DelimitedToken, _super);
        function DelimitedToken(raw, pos, input, file, line) {
            var _this = _super.call(this, raw, pos, input, file, line) || this;
            _this.trimLeft = raw[2] === '-';
            _this.trimRight = raw[raw.length - 3] === '-';
            _this.value = raw.slice(_this.trimLeft ? 3 : 2, _this.trimRight ? -3 : -2).trim();
            return _this;
        }
        return DelimitedToken;
    }(Token));

    var TagToken = /** @class */ (function (_super) {
        __extends(TagToken, _super);
        function TagToken(raw, pos, input, file, line) {
            var _this = _super.call(this, raw, pos, input, file, line) || this;
            _this.type = 'tag';
            var match = _this.value.match(tagLine);
            if (!match) {
                throw new TokenizationError("illegal tag syntax", _this);
            }
            _this.name = match[1];
            _this.args = match[2];
            return _this;
        }
        return TagToken;
    }(DelimitedToken));

    var OutputToken = /** @class */ (function (_super) {
        __extends(OutputToken, _super);
        function OutputToken(raw, pos, input, file, line) {
            var _this = _super.call(this, raw, pos, input, file, line) || this;
            _this.type = 'output';
            return _this;
        }
        return OutputToken;
    }(DelimitedToken));

    var ParseState;
    (function (ParseState) {
        ParseState[ParseState["HTML"] = 0] = "HTML";
        ParseState[ParseState["OUTPUT"] = 1] = "OUTPUT";
        ParseState[ParseState["TAG"] = 2] = "TAG";
    })(ParseState || (ParseState = {}));
    var Tokenizer = /** @class */ (function () {
        function Tokenizer(options) {
            if (options === void 0) { options = defaultOptions; }
            this.options = options;
        }
        Tokenizer.prototype.tokenize = function (input, file) {
            var tokens = [];
            var p = 0;
            var line = 1;
            var state = ParseState.HTML;
            var buffer = '';
            var bufferBegin = 0;
            while (p < input.length) {
                if (input[p] === '\n')
                    line++;
                var bin = input.substr(p, 2);
                if (state === ParseState.HTML) {
                    if (bin === '{{' || bin === '{%') {
                        if (buffer)
                            tokens.push(new HTMLToken(buffer, bufferBegin, input, file, line));
                        buffer = bin;
                        bufferBegin = p;
                        p += 2;
                        state = bin === '{{' ? ParseState.OUTPUT : ParseState.TAG;
                        continue;
                    }
                }
                else if (state === ParseState.OUTPUT && bin === '}}') {
                    buffer += '}}';
                    tokens.push(new OutputToken(buffer, bufferBegin, input, file, line));
                    p += 2;
                    buffer = '';
                    bufferBegin = p;
                    state = ParseState.HTML;
                    continue;
                }
                else if (bin === '%}') {
                    buffer += '%}';
                    tokens.push(new TagToken(buffer, bufferBegin, input, file, line));
                    p += 2;
                    buffer = '';
                    bufferBegin = p;
                    state = ParseState.HTML;
                    continue;
                }
                buffer += input[p++];
            }
            if (buffer)
                tokens.push(new HTMLToken(buffer, bufferBegin, input, file, line));
            whiteSpaceCtrl(tokens, this.options);
            return tokens;
        };
        return Tokenizer;
    }());

    var Render = /** @class */ (function () {
        function Render() {
        }
        Render.prototype.renderTemplates = function (templates, scope) {
            return __awaiter(this, void 0, void 0, function () {
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
                            return [4 /*yield*/, tpl.render(scope)];
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
        };
        return Render;
    }());

    var operators$1 = {
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

    /**
     * Key-Value Pairs Representing Tag Arguments
     * Example:
     *    For the markup `{% include 'head.html' foo='bar' %}`,
     *    hash['foo'] === 'bar'
     */
    var Hash = /** @class */ (function () {
        function Hash(markup, scope) {
            var match;
            hashCapture.lastIndex = 0;
            while ((match = hashCapture.exec(markup))) {
                var k = match[1];
                var v = match[2];
                this[k] = evalValue(v, scope);
            }
        }
        return Hash;
    }());

    var Template = /** @class */ (function () {
        function Template(token) {
            this.token = token;
        }
        return Template;
    }());

    var Tag = /** @class */ (function (_super) {
        __extends(Tag, _super);
        function Tag(token, tokens, liquid) {
            var _this = _super.call(this, token) || this;
            _this.name = token.name;
            var impl = Tag.impls[token.name];
            assert(impl, "tag " + token.name + " not found");
            _this.impl = create(impl);
            _this.impl.liquid = liquid;
            if (_this.impl.parse) {
                _this.impl.parse(token, tokens);
            }
            return _this;
        }
        Tag.prototype.render = function (scope) {
            return __awaiter(this, void 0, void 0, function () {
                var hash, impl, html;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            hash = new Hash(this.token.args, scope);
                            impl = this.impl;
                            if (typeof impl.render !== 'function') {
                                return [2 /*return*/, ''];
                            }
                            return [4 /*yield*/, impl.render(scope, hash)];
                        case 1:
                            html = _a.sent();
                            return [2 /*return*/, stringify(html)];
                    }
                });
            });
        };
        Tag.register = function (name, tag) {
            Tag.impls[name] = tag;
        };
        Tag.clear = function () {
            Tag.impls = {};
        };
        Tag.impls = {};
        return Tag;
    }(Template));

    var valueRE = new RegExp("" + value.source, 'g');
    var Filter = /** @class */ (function () {
        function Filter(str, strictFilters) {
            if (strictFilters === void 0) { strictFilters = false; }
            var match = filterLine.exec(str);
            assert(match, 'illegal filter: ' + str);
            var name = match[1];
            var argList = match[2] || '';
            var impl = Filter.impls[name];
            if (!impl && strictFilters)
                throw new TypeError("undefined filter: " + name);
            this.name = name;
            this.impl = impl || (function (x) { return x; });
            this.args = this.parseArgs(argList);
        }
        Filter.prototype.parseArgs = function (argList) {
            var match;
            var args = [];
            while ((match = valueRE.exec(argList.trim()))) {
                var v = match[0];
                var re = new RegExp(v + "\\s*:", 'g');
                var keyMatch = re.exec(match.input);
                var currentMatchIsKey = keyMatch && keyMatch.index === match.index;
                currentMatchIsKey ? args.push("'" + v + "'") : args.push(v);
            }
            return args;
        };
        Filter.prototype.render = function (value$$1, scope) {
            var args = this.args.map(function (arg) { return evalValue(arg, scope); });
            args.unshift(value$$1);
            return this.impl.apply(null, args);
        };
        Filter.register = function (name, filter$$1) {
            Filter.impls[name] = filter$$1;
        };
        Filter.clear = function () {
            Filter.impls = {};
        };
        Filter.impls = {};
        return Filter;
    }());

    var ParseStream = /** @class */ (function () {
        function ParseStream(tokens, parseToken) {
            this.handlers = {};
            this.tokens = tokens;
            this.parseToken = parseToken;
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
                var template = this.parseToken(token, this.tokens);
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

    var default_1 = /** @class */ (function () {
        function default_1(str, strictFilters) {
            var match = matchValue(str);
            assert(match, "illegal value string: " + str);
            var initial = match[0];
            str = str.substr(match.index + match[0].length);
            var filters = [];
            while ((match = filter.exec(str))) {
                filters.push([match[0].trim()]);
            }
            this.initial = initial;
            this.filters = filters.map(function (str) { return new Filter(str, strictFilters); });
        }
        default_1.prototype.value = function (scope) {
            return this.filters.reduce(function (prev, filter$$1) { return filter$$1.render(prev, scope); }, evalExp(this.initial, scope));
        };
        return default_1;
    }());

    var Output = /** @class */ (function (_super) {
        __extends(Output, _super);
        function Output(token, strictFilters) {
            var _this = _super.call(this, token) || this;
            _this.value = new default_1(token.value, strictFilters);
            return _this;
        }
        Output.prototype.render = function (scope) {
            return __awaiter(this, void 0, void 0, function () {
                var html;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.value.value(scope)];
                        case 1:
                            html = _a.sent();
                            return [2 /*return*/, stringify(html)];
                    }
                });
            });
        };
        return Output;
    }(Template));

    var default_1$1 = /** @class */ (function (_super) {
        __extends(default_1, _super);
        function default_1(token) {
            var _this = _super.call(this, token) || this;
            _this.str = token.value;
            return _this;
        }
        default_1.prototype.render = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.str];
                });
            });
        };
        return default_1;
    }(Template));

    var Parser = /** @class */ (function () {
        function Parser(liquid) {
            this.liquid = liquid;
        }
        Parser.prototype.parse = function (tokens) {
            var token;
            var templates = [];
            while ((token = tokens.shift())) {
                templates.push(this.parseToken(token, tokens));
            }
            return templates;
        };
        Parser.prototype.parseToken = function (token, remainTokens) {
            try {
                if (token.type === 'tag') {
                    return new Tag(token, remainTokens, this.liquid);
                }
                if (token.type === 'output') {
                    return new Output(token, this.liquid.options.strict_filters);
                }
                return new default_1$1(token);
            }
            catch (e) {
                throw new ParseError(e, token);
            }
        };
        Parser.prototype.parseStream = function (tokens) {
            var _this = this;
            return new ParseStream(tokens, function (token, tokens) { return _this.parseToken(token, tokens); });
        };
        return Parser;
    }());

    var re = new RegExp("(" + identifier.source + ")\\s*=([^]*)");
    var assign$1 = {
        parse: function (token) {
            var match = token.args.match(re);
            assert(match, "illegal token " + token.raw);
            this.key = match[1];
            this.value = match[2];
        },
        render: function (scope) {
            var ctx = new AssignScope();
            ctx[this.key] = this.liquid.evalValue(this.value, scope);
            scope.push(ctx);
            return Promise.resolve('');
        }
    };

    /*
     * Call functions in serial until someone resolved.
     * @param iterable the array to iterate with.
     * @param iteratee returns a new promise.
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

    var re$1 = new RegExp("^(" + identifier.source + ")\\s+in\\s+" +
        ("(" + value.source + ")") +
        ("(?:\\s+" + hash.source + ")*") +
        "(?:\\s+(reversed))?" +
        ("(?:\\s+" + hash.source + ")*$"));
    function parse(tagToken, remainTokens) {
        var _this = this;
        var match = re$1.exec(tagToken.args);
        assert(match, "illegal tag: " + tagToken.raw);
        this.variable = match[1];
        this.collection = match[2];
        this.reversed = !!match[3];
        this.templates = [];
        this.elseTemplates = [];
        var p;
        var stream = this.liquid.parser.parseStream(remainTokens)
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
                        collection = evalExp(this.collection, scope);
                        if (!isArray(collection)) {
                            if (isString(collection) && collection.length > 0) {
                                collection = [collection];
                            }
                            else if (isObject(collection)) {
                                collection = Object.keys(collection).map(function (key) { return [key, collection[key]]; });
                            }
                        }
                        if (!isArray(collection) || !collection.length) {
                            return [2 /*return*/, this.liquid.renderer.renderTemplates(this.elseTemplates, scope)];
                        }
                        offset = hash$$1.offset || 0;
                        limit = (hash$$1.limit === undefined) ? collection.length : hash$$1.limit;
                        collection = collection.slice(offset, offset + limit);
                        if (this.reversed)
                            collection.reverse();
                        contexts = collection.map(function (item, i) {
                            var ctx = {};
                            ctx[_this.variable] = item;
                            ctx['forloop'] = {
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
                                            return [4 /*yield*/, this.liquid.renderer.renderTemplates(this.templates, scope)];
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
    var For = { parse: parse, render: render };

    var re$2 = new RegExp("(" + identifier.source + ")");
    var capture = {
        parse: function (tagToken, remainTokens) {
            var _this = this;
            var match = tagToken.args.match(re$2);
            assert(match, tagToken.args + " not valid identifier");
            this.variable = match[1];
            this.templates = [];
            var stream = this.liquid.parser.parseStream(remainTokens);
            stream.on('tag:endcapture', function () { return stream.stop(); })
                .on('template', function (tpl) { return _this.templates.push(tpl); })
                .on('end', function () {
                throw new Error("tag " + tagToken.raw + " not closed");
            });
            stream.start();
        },
        render: function (scope) {
            return __awaiter(this, void 0, void 0, function () {
                var html, ctx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.liquid.renderer.renderTemplates(this.templates, scope)];
                        case 1:
                            html = _a.sent();
                            ctx = new CaptureScope();
                            ctx[this.variable] = html;
                            scope.push(ctx);
                            return [2 /*return*/];
                    }
                });
            });
        }
    };

    var Case = {
        parse: function (tagToken, remainTokens) {
            var _this = this;
            this.cond = tagToken.args;
            this.cases = [];
            this.elseTemplates = [];
            var p = [];
            var stream = this.liquid.parser.parseStream(remainTokens)
                .on('tag:when', function (token) {
                _this.cases.push({
                    val: token.args,
                    templates: p = []
                });
            })
                .on('tag:else', function () { return (p = _this.elseTemplates); })
                .on('tag:endcase', function () { return stream.stop(); })
                .on('template', function (tpl) { return p.push(tpl); })
                .on('end', function () {
                throw new Error("tag " + tagToken.raw + " not closed");
            });
            stream.start();
        },
        render: function (scope) {
            for (var i = 0; i < this.cases.length; i++) {
                var branch = this.cases[i];
                var val = evalExp(branch.val, scope);
                var cond = evalExp(this.cond, scope);
                if (val === cond) {
                    return this.liquid.renderer.renderTemplates(branch.templates, scope);
                }
            }
            return this.liquid.renderer.renderTemplates(this.elseTemplates, scope);
        }
    };

    var comment = {
        parse: function (tagToken, remainTokens) {
            var stream = this.liquid.parser.parseStream(remainTokens);
            stream
                .on('token', function (token) {
                if (token.name === 'endcomment')
                    stream.stop();
            })
                .on('end', function () {
                throw new Error("tag " + tagToken.raw + " not closed");
            });
            stream.start();
        }
    };

    var staticFileRE = /[^\s,]+/;
    var withRE = new RegExp("with\\s+(" + value.source + ")");
    var include = {
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
                            return [4 /*yield*/, this.liquid.parseAndRender(template, scope.getAll(), scope.opts)];
                        case 1:
                            filepath = _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            filepath = evalValue(this.value, scope);
                            _a.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            filepath = this.staticValue;
                            _a.label = 5;
                        case 5:
                            assert(filepath, "cannot include with empty filename");
                            originBlocks = scope.blocks;
                            originBlockMode = scope.blockMode;
                            scope.blocks = {};
                            scope.blockMode = BlockMode$1.OUTPUT;
                            if (this.with) {
                                hash$$1[filepath] = evalValue(this.with, scope);
                            }
                            return [4 /*yield*/, this.liquid.getTemplate(filepath, scope.opts)];
                        case 6:
                            templates = _a.sent();
                            scope.push(hash$$1);
                            return [4 /*yield*/, this.liquid.renderer.renderTemplates(templates, scope)];
                        case 7:
                            html = _a.sent();
                            scope.pop(hash$$1);
                            scope.blocks = originBlocks;
                            scope.blockMode = originBlockMode;
                            return [2 /*return*/, html];
                    }
                });
            });
        }
    };

    var decrement = {
        parse: function (token) {
            var match = token.args.match(identifier);
            assert(match, "illegal identifier " + token.args);
            this.variable = match[0];
        },
        render: function (scope) {
            var context = scope.findContextFor(this.variable, function (ctx) {
                return !(ctx instanceof CaptureScope) && !(ctx instanceof AssignScope);
            });
            if (!context) {
                context = new DecrementScope();
                scope.unshift(context);
            }
            if (typeof context[this.variable] !== 'number') {
                context[this.variable] = 0;
            }
            return --context[this.variable];
        }
    };

    var groupRE = new RegExp("^(?:(" + value.source + ")\\s*:\\s*)?(.*)$");
    var candidatesRE = new RegExp(value.source, 'g');
    var cycle = {
        parse: function (tagToken) {
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
        render: function (scope) {
            var group = evalValue(this.group, scope);
            var fingerprint = "cycle:" + group + ":" + this.candidates.join(',');
            var groups = scope.opts.groups = scope.opts.groups || {};
            var idx = groups[fingerprint];
            if (idx === undefined) {
                idx = groups[fingerprint] = 0;
            }
            var candidate = this.candidates[idx];
            idx = (idx + 1) % this.candidates.length;
            groups[fingerprint] = idx;
            return evalValue(candidate, scope);
        }
    };

    var If = {
        parse: function (tagToken, remainTokens) {
            var _this = this;
            this.branches = [];
            this.elseTemplates = [];
            var p;
            var stream = this.liquid.parser.parseStream(remainTokens)
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
                .on('tag:endif', function () { return stream.stop(); })
                .on('template', function (tpl) { return p.push(tpl); })
                .on('end', function () {
                throw new Error("tag " + tagToken.raw + " not closed");
            });
            stream.start();
        },
        render: function (scope) {
            for (var _i = 0, _a = this.branches; _i < _a.length; _i++) {
                var branch = _a[_i];
                var cond = evalExp(branch.cond, scope);
                if (isTruthy(cond)) {
                    return this.liquid.renderer.renderTemplates(branch.templates, scope);
                }
            }
            return this.liquid.renderer.renderTemplates(this.elseTemplates, scope);
        }
    };

    var increment = {
        parse: function (token) {
            var match = token.args.match(identifier);
            assert(match, "illegal identifier " + token.args);
            this.variable = match[0];
        },
        render: function (scope) {
            var context = scope.findContextFor(this.variable, function (ctx) {
                return !(ctx instanceof CaptureScope) && !(ctx instanceof AssignScope);
            });
            if (!context) {
                context = new IncrementScope();
                scope.unshift(context);
            }
            if (typeof context[this.variable] !== 'number') {
                context[this.variable] = 0;
            }
            var val = context[this.variable];
            context[this.variable]++;
            return val;
        }
    };

    var staticFileRE$1 = /\S+/;
    var layout = {
        parse: function (token, remainTokens) {
            var match = staticFileRE$1.exec(token.args);
            if (match) {
                this.staticLayout = match[0];
            }
            match = value.exec(token.args);
            if (match) {
                this.layout = match[0];
            }
            this.tpls = this.liquid.parser.parse(remainTokens);
        },
        render: function (scope, hash$$1) {
            return __awaiter(this, void 0, void 0, function () {
                var layout, html, templates, partial;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            layout = scope.opts.dynamicPartials
                                ? evalValue(this.layout, scope)
                                : this.staticLayout;
                            assert(layout, "cannot apply layout with empty filename");
                            // render the remaining tokens immediately
                            scope.blockMode = BlockMode$1.STORE;
                            return [4 /*yield*/, this.liquid.renderer.renderTemplates(this.tpls, scope)];
                        case 1:
                            html = _a.sent();
                            if (scope.blocks[''] === undefined) {
                                scope.blocks[''] = html;
                            }
                            return [4 /*yield*/, this.liquid.getTemplate(layout, scope.opts)];
                        case 2:
                            templates = _a.sent();
                            scope.push(hash$$1);
                            scope.blockMode = BlockMode$1.OUTPUT;
                            return [4 /*yield*/, this.liquid.renderer.renderTemplates(templates, scope)];
                        case 3:
                            partial = _a.sent();
                            scope.pop(hash$$1);
                            return [2 /*return*/, partial];
                    }
                });
            });
        }
    };

    var block = {
        parse: function (token, remainTokens) {
            var _this = this;
            var match = /\w+/.exec(token.args);
            this.block = match ? match[0] : '';
            this.tpls = [];
            var stream = this.liquid.parser.parseStream(remainTokens)
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
                            childDefined = scope.blocks[this.block];
                            if (!(childDefined !== undefined)) return [3 /*break*/, 1];
                            _a = childDefined;
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, this.liquid.renderer.renderTemplates(this.tpls, scope)];
                        case 2:
                            _a = _b.sent();
                            _b.label = 3;
                        case 3:
                            html = _a;
                            if (scope.blockMode === BlockMode$1.STORE) {
                                scope.blocks[this.block] = html;
                                return [2 /*return*/, ''];
                            }
                            return [2 /*return*/, html];
                    }
                });
            });
        }
    };

    var raw = {
        parse: function (tagToken, remainTokens) {
            var _this = this;
            this.tokens = [];
            var stream = this.liquid.parser.parseStream(remainTokens);
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
        render: function () {
            return this.tokens.map(function (token) { return token.raw; }).join('');
        }
    };

    var re$3 = new RegExp("^(" + identifier.source + ")\\s+in\\s+" +
        ("(" + value.source + ")") +
        ("(?:\\s+" + hash.source + ")*$"));
    var tablerow = {
        parse: function (tagToken, remainTokens) {
            var _this = this;
            var match = re$3.exec(tagToken.args);
            assert(match, "illegal tag: " + tagToken.raw);
            this.variable = match[1];
            this.collection = match[2];
            this.templates = [];
            var p;
            var stream = this.liquid.parser.parseStream(remainTokens)
                .on('start', function () { return (p = _this.templates); })
                .on('tag:endtablerow', function () { return stream.stop(); })
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
                            collection = evalExp(this.collection, scope) || [];
                            offset = hash$$1.offset || 0;
                            limit = (hash$$1.limit === undefined) ? collection.length : hash$$1.limit;
                            collection = collection.slice(offset, offset + limit);
                            cols = hash$$1.cols || collection.length;
                            contexts = collection.map(function (item) {
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
                                                return [4 /*yield*/, this.liquid.renderer.renderTemplates(this.templates, scope)];
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
    };

    var unless = {
        parse: function (tagToken, remainTokens) {
            var _this = this;
            this.templates = [];
            this.elseTemplates = [];
            var p;
            var stream = this.liquid.parser.parseStream(remainTokens)
                .on('start', function () {
                p = _this.templates;
                _this.cond = tagToken.args;
            })
                .on('tag:else', function () { return (p = _this.elseTemplates); })
                .on('tag:endunless', function () { return stream.stop(); })
                .on('template', function (tpl) { return p.push(tpl); })
                .on('end', function () {
                throw new Error("tag " + tagToken.raw + " not closed");
            });
            stream.start();
        },
        render: function (scope) {
            var cond = evalExp(this.cond, scope);
            return isFalsy(cond)
                ? this.liquid.renderer.renderTemplates(this.templates, scope)
                : this.liquid.renderer.renderTemplates(this.elseTemplates, scope);
        }
    };

    var Break = {
        render: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    throw new RenderBreakError('break');
                });
            });
        }
    };

    var Continue = {
        render: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    throw new RenderBreakError('continue');
                });
            });
        }
    };

    var tags = {
        assign: assign$1, 'for': For, capture: capture, 'case': Case, comment: comment, include: include, decrement: decrement, increment: increment, cycle: cycle, 'if': If, layout: layout, block: block, raw: raw, tablerow: tablerow, unless: unless, 'break': Break, 'continue': Continue
    };

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
    function escape(str) {
        return String(str).replace(/&|<|>|"|'/g, function (m) { return escapeMap[m]; });
    }
    function unescape(str) {
        return String(str).replace(/&(amp|lt|gt|#34|#39);/g, function (m) { return unescapeMap[m]; });
    }
    var html = {
        'escape': escape,
        'escape_once': function (str) { return escape(unescape(str)); },
        'newline_to_br': function (v) { return v.replace(/\n/g, '<br />'); },
        'strip_html': function (v) { return String(v).replace(/<script.*?<\/script>|<!--.*?-->|<style.*?<\/style>|<.*?>/g, ''); }
    };

    var str = {
        'append': function (v, arg) { return v + arg; },
        'prepend': function (v, arg) { return arg + v; },
        'capitalize': function (str) { return String(str).charAt(0).toUpperCase() + str.slice(1); },
        'concat': function (v, arg) { return Array.prototype.concat.call(v, arg); },
        'lstrip': function (v) { return String(v).replace(/^\s+/, ''); },
        'downcase': function (v) { return v.toLowerCase(); },
        'upcase': function (str) { return String(str).toUpperCase(); },
        'remove': function (v, arg) { return v.split(arg).join(''); },
        'remove_first': function (v, l) { return v.replace(l, ''); },
        'replace': function (v, pattern, replacement) {
            return String(v).split(pattern).join(replacement);
        },
        'replace_first': function (v, arg1, arg2) { return String(v).replace(arg1, arg2); },
        'rstrip': function (str) { return String(str).replace(/\s+$/, ''); },
        'split': function (v, arg) { return String(v).split(arg); },
        'strip': function (v) { return String(v).trim(); },
        'strip_newlines': function (v) { return String(v).replace(/\n/g, ''); },
        'truncate': function (v, l, o) {
            v = String(v);
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
        }
    };

    var math = {
        'abs': function (v) { return Math.abs(v); },
        'ceil': function (v) { return Math.ceil(v); },
        'divided_by': function (v, arg) { return v / arg; },
        'floor': function (v) { return Math.floor(v); },
        'minus': bindFixed(function (v, arg) { return v - arg; }),
        'modulo': bindFixed(function (v, arg) { return v % arg; }),
        'round': function (v, arg) {
            var amp = Math.pow(10, arg || 0);
            return Math.round(v * amp) / amp;
        },
        'plus': bindFixed(function (v, arg) { return Number(v) + Number(arg); }),
        'times': function (v, arg) { return v * arg; }
    };
    function getFixed(v) {
        var p = String(v).split('.');
        return (p.length > 1) ? p[1].length : 0;
    }
    function bindFixed(cb) {
        return function (l, r) {
            var f = Math.max(getFixed(l), getFixed(r));
            return cb(l, r).toFixed(f);
        };
    }

    var url = {
        'url_decode': function (x) { return x.split('+').map(decodeURIComponent).join(' '); },
        'url_encode': function (x) { return x.split(' ').map(encodeURIComponent).join('+'); }
    };

    var array = {
        'join': function (v, arg) { return v.join(arg === undefined ? ' ' : arg); },
        'last': function (v) { return last(v); },
        'first': function (v) { return v[0]; },
        'map': function (arr, arg) { return arr.map(function (v) { return v[arg]; }); },
        'reverse': function (v) { return v.reverse(); },
        'sort': function (v, arg) { return v.sort(arg); },
        'size': function (v) { return v.length; },
        'slice': function (v, begin, length) {
            if (length === undefined)
                length = 1;
            return v.slice(begin, begin + length);
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
        }
    };

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
        getWeekOfYear: function (d, startDay) {
            // Skip to startDay of this week
            var now = this.getDayOfYear(d) + (startDay - d.getDay());
            // Find the first startDay of the year
            var jan1 = new Date(d.getFullYear(), 0, 1);
            var then = (7 - jan1.getDay() + startDay);
            return padStart(String(Math.floor((now - then) / 7) + 1), 2, '0');
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
            return padStart(d.getDate(), 2, '0');
        },
        e: function (d) {
            return padStart(d.getDate(), 2);
        },
        H: function (d) {
            return padStart(d.getHours(), 2, '0');
        },
        I: function (d) {
            return padStart(String(d.getHours() % 12 || 12), 2, '0');
        },
        j: function (d) {
            return padStart(_date.getDayOfYear(d), 3, '0');
        },
        k: function (d) {
            return padStart(d.getHours(), 2);
        },
        l: function (d) {
            return padStart(String(d.getHours() % 12 || 12), 2);
        },
        L: function (d) {
            return padStart(d.getMilliseconds(), 3, '0');
        },
        m: function (d) {
            return padStart(d.getMonth() + 1, 2, '0');
        },
        M: function (d) {
            return padStart(d.getMinutes(), 2, '0');
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
            return padStart(d.getSeconds(), 2, '0');
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
            return (tz > 0 ? '-' : '+') + padStart(String(Math.abs(tz)), 4, '0');
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

    var date = {
        'date': function (v, arg) {
            var date = v;
            if (v === 'now') {
                date = new Date();
            }
            else if (isString(v)) {
                date = new Date(v);
            }
            return isValidDate(date) ? strftime(date, arg) : v;
        }
    };
    function isValidDate(date) {
        return date instanceof Date && !isNaN(date.getTime());
    }

    var obj = {
        'default': function (v, arg) { return isTruthy(v) ? v : arg; }
    };

    var builtinFilters = __assign({}, html, str, math, url, date, obj, array);

    var Liquid = /** @class */ (function () {
        function Liquid(opts) {
            if (opts === void 0) { opts = {}; }
            var _this = this;
            var options = __assign({}, defaultOptions, normalize(opts));
            if (options.cache) {
                this.cache = {};
            }
            this.options = options;
            this.parser = new Parser(this);
            this.renderer = new Render();
            this.tokenizer = new Tokenizer(this.options);
            forOwn(tags, function (conf, name) { return _this.registerTag(name, conf); });
            forOwn(builtinFilters, function (handler, name) { return _this.registerFilter(name, handler); });
        }
        Liquid.prototype.parse = function (html, filepath) {
            var tokens = this.tokenizer.tokenize(html, filepath);
            return this.parser.parse(tokens);
        };
        Liquid.prototype.render = function (tpl, ctx, opts) {
            var options = __assign({}, this.options, normalize(opts));
            var scope = new Scope(ctx, options);
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
        Liquid.prototype.getTemplate = function (file, opts) {
            return __awaiter(this, void 0, void 0, function () {
                var options, roots, paths, _i, paths_1, filepath, value, _a, err;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            options = normalize(opts);
                            roots = options.root ? options.root.concat(this.options.root) : this.options.root;
                            paths = roots.map(function (root) { return fs.resolve(root, file, _this.options.extname); });
                            _i = 0, paths_1 = paths;
                            _b.label = 1;
                        case 1:
                            if (!(_i < paths_1.length)) return [3 /*break*/, 5];
                            filepath = paths_1[_i];
                            return [4 /*yield*/, fs.exists(filepath)];
                        case 2:
                            if (!(_b.sent()))
                                return [3 /*break*/, 4];
                            if (this.options.cache && this.cache[filepath])
                                return [2 /*return*/, this.cache[filepath]];
                            _a = this.parse;
                            return [4 /*yield*/, fs.readFile(filepath)];
                        case 3:
                            value = _a.apply(this, [_b.sent(), filepath]);
                            if (this.options.cache)
                                this.cache[filepath] = value;
                            return [2 /*return*/, value];
                        case 4:
                            _i++;
                            return [3 /*break*/, 1];
                        case 5:
                            err = new Error('ENOENT');
                            err.message = "ENOENT: Failed to lookup \"" + file + "\" in \"" + roots + "\"";
                            err.code = 'ENOENT';
                            throw err;
                    }
                });
            });
        };
        Liquid.prototype.renderFile = function (file, ctx, opts) {
            return __awaiter(this, void 0, void 0, function () {
                var options, templates;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            options = normalize(opts);
                            return [4 /*yield*/, this.getTemplate(file, options)];
                        case 1:
                            templates = _a.sent();
                            return [2 /*return*/, this.render(templates, ctx, opts)];
                    }
                });
            });
        };
        Liquid.prototype.evalValue = function (str, scope) {
            return new default_1(str, this.options.strict_filters).value(scope);
        };
        Liquid.prototype.registerFilter = function (name, filter) {
            return Filter.register(name, filter);
        };
        Liquid.prototype.registerTag = function (name, tag) {
            return Tag.register(name, tag);
        };
        Liquid.prototype.plugin = function (plugin) {
            return plugin.call(this, Liquid);
        };
        Liquid.prototype.express = function () {
            var self = this;
            return function (filePath, ctx, cb) {
                var opts = { root: this.root };
                self.renderFile(filePath, ctx, opts).then(function (html) { return cb(null, html); }, cb);
            };
        };
        Liquid.default = Liquid;
        Liquid.isTruthy = isTruthy;
        Liquid.isFalsy = isFalsy;
        Liquid.evalExp = evalExp;
        Liquid.evalValue = evalValue;
        Liquid.Types = Types;
        return Liquid;
    }());

    return Liquid;

}));
//# sourceMappingURL=liquid.js.map
