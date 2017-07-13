(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Liquid = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var strftime = require('./src/util/strftime.js');
var _ = require('./src/util/underscore.js');
var isTruthy = require('./src/syntax.js').isTruthy;

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
    'abs': function abs(v) {
        return Math.abs(v);
    },
    'append': function append(v, arg) {
        return v + arg;
    },
    'capitalize': function capitalize(str) {
        return stringify(str).charAt(0).toUpperCase() + str.slice(1);
    },
    'ceil': function ceil(v) {
        return Math.ceil(v);
    },
    'date': function date(v, arg) {
        if (v === 'now') v = new Date();
        return v instanceof Date ? strftime(v, arg) : '';
    },
    'default': function _default(v, arg) {
        return isTruthy(v) ? v : arg;
    },
    'divided_by': function divided_by(v, arg) {
        return Math.floor(v / arg);
    },
    'downcase': function downcase(v) {
        return v.toLowerCase();
    },
    'escape': escape,

    'escape_once': function escape_once(str) {
        return escape(unescape(str));
    },
    'first': function first(v) {
        return v[0];
    },
    'floor': function floor(v) {
        return Math.floor(v);
    },
    'join': function join(v, arg) {
        return v.join(arg);
    },
    'last': function last(v) {
        return v[v.length - 1];
    },
    'lstrip': function lstrip(v) {
        return stringify(v).replace(/^\s+/, '');
    },
    'map': function map(arr, arg) {
        return arr.map(function (v) {
            return v[arg];
        });
    },
    'minus': bindFixed(function (v, arg) {
        return v - arg;
    }),
    'modulo': bindFixed(function (v, arg) {
        return v % arg;
    }),
    'newline_to_br': function newline_to_br(v) {
        return v.replace(/\n/g, '<br />');
    },
    'plus': bindFixed(function (v, arg) {
        return Number(v) + Number(arg);
    }),
    'prepend': function prepend(v, arg) {
        return arg + v;
    },
    'remove': function remove(v, arg) {
        return v.split(arg).join('');
    },
    'remove_first': function remove_first(v, l) {
        return v.replace(l, '');
    },
    'replace': function replace(v, pattern, replacement) {
        return stringify(v).split(pattern).join(replacement);
    },
    'replace_first': function replace_first(v, arg1, arg2) {
        return stringify(v).replace(arg1, arg2);
    },
    'reverse': function reverse(v) {
        return v.reverse();
    },
    'round': function round(v, arg) {
        var amp = Math.pow(10, arg || 0);
        return Math.round(v * amp, arg) / amp;
    },
    'rstrip': function rstrip(str) {
        return stringify(str).replace(/\s+$/, '');
    },
    'size': function size(v) {
        return v.length;
    },
    'slice': function slice(v, begin, length) {
        return v.substr(begin, length === undefined ? 1 : length);
    },
    'sort': function sort(v, arg) {
        return v.sort(arg);
    },
    'split': function split(v, arg) {
        return stringify(v).split(arg);
    },
    'strip': function strip(v) {
        return stringify(v).trim();
    },
    'strip_html': function strip_html(v) {
        return stringify(v).replace(/<\/?\s*\w+\s*\/?>/g, '');
    },
    'strip_newlines': function strip_newlines(v) {
        return stringify(v).replace(/\n/g, '');
    },
    'times': function times(v, arg) {
        return v * arg;
    },
    'truncate': function truncate(v, l, o) {
        v = stringify(v);
        o = o === undefined ? '...' : o;
        l = l || 16;
        if (v.length <= l) return v;
        return v.substr(0, l - o.length) + o;
    },
    'truncatewords': function truncatewords(v, l, o) {
        if (o === undefined) o = '...';
        var arr = v.split(' ');
        var ret = arr.slice(0, l).join(' ');
        if (arr.length > l) ret += o;
        return ret;
    },
    'uniq': function uniq(arr) {
        var u = {};
        return (arr || []).filter(function (val) {
            if (u.hasOwnProperty(val)) {
                return false;
            }
            u[val] = true;
            return true;
        });
    },
    'upcase': function upcase(str) {
        return stringify(str).toUpperCase();
    },
    'url_encode': encodeURIComponent
};

function escape(str) {
    return stringify(str).replace(/&|<|>|"|'/g, function (m) {
        return escapeMap[m];
    });
}

function unescape(str) {
    return stringify(str).replace(/&(amp|lt|gt|#34|#39);/g, function (m) {
        return unescapeMap[m];
    });
}

function getFixed(v) {
    var p = (v + "").split(".");
    return p.length > 1 ? p[1].length : 0;
}

function getMaxFixed(l, r) {
    return Math.max(getFixed(l), getFixed(r));
}

function stringify(obj) {
    obj = obj || "";
    return obj + '';
}

function bindFixed(cb) {
    return function (l, r) {
        var f = getMaxFixed(l, r);
        return cb(l, r).toFixed(f);
    };
}

function registerAll(liquid) {
    return _.forOwn(filters, function (func, name) {
        return liquid.registerFilter(name, func);
    });
}

registerAll.filters = filters;
module.exports = registerAll;

},{"./src/syntax.js":13,"./src/util/strftime.js":20,"./src/util/underscore.js":21}],2:[function(require,module,exports){
'use strict';

var Scope = require('./src/scope');
var _ = require('./src/util/underscore.js');
var assert = require('./src/util/assert.js');
var tokenizer = require('./src/tokenizer.js');
var statFileAsync = require('./src/util/fs.js').statFileAsync;
var readFileAsync = require('./src/util/fs.js').readFileAsync;
var path = require('path');
var Render = require('./src/render.js');
var lexical = require('./src/lexical.js');
var Tag = require('./src/tag.js');
var Filter = require('./src/filter.js');
var Parser = require('./src/parser');
var Syntax = require('./src/syntax.js');
var tags = require('./tags');
var filters = require('./filters');
var Promise = require('any-promise');
var anySeries = require('./src/util/promise.js').anySeries;
var Errors = require('./src/util/error.js');

var _engine = {
  init: function init(tag, filter, options) {
    if (options.cache) {
      this.cache = {};
    }
    this.options = options;
    this.tag = tag;
    this.filter = filter;
    this.parser = Parser(tag, filter);
    this.renderer = Render();

    tags(this);
    filters(this);

    return this;
  },
  parse: function parse(html, filepath) {
    var tokens = tokenizer.parse(html, filepath, this.options);
    return this.parser.parse(tokens);
  },
  render: function render(tpl, ctx, opts) {
    opts = _.assign({}, this.options, opts);
    var scope = Scope.factory(ctx, opts);
    return this.renderer.renderTemplates(tpl, scope);
  },
  parseAndRender: function parseAndRender(html, ctx, opts) {
    var _this = this;

    return Promise.resolve().then(function () {
      return _this.parse(html);
    }).then(function (tpl) {
      return _this.render(tpl, ctx, opts);
    }).catch(function (e) {
      if (e instanceof Errors.RenderBreakError) {
        return e.html;
      }
      throw e;
    });
  },
  renderFile: function renderFile(filepath, ctx, opts) {
    var _this2 = this;

    opts = _.assign({}, opts);
    return this.getTemplate(filepath, opts.root).then(function (templates) {
      return _this2.render(templates, ctx, opts);
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
  lookup: function lookup(filepath, root) {
    root = this.options.root.concat(root || []);
    root = _.uniq(root);
    var paths = root.map(function (root) {
      return path.resolve(root, filepath);
    });
    return anySeries(paths, function (path) {
      return statFileAsync(path).then(function () {
        return path;
      });
    }).catch(function (e) {
      if (e.code === 'ENOENT') {
        e.message = 'Failed to lookup ' + filepath + ' in: ' + root;
      }
      throw e;
    });
  },
  getTemplate: function getTemplate(filepath, root) {
    var _this3 = this;

    if (!path.extname(filepath)) {
      filepath += this.options.extname;
    }
    return this.lookup(filepath, root).then(function (filepath) {
      if (_this3.options.cache) {
        var tpl = _this3.cache[filepath];
        if (tpl) {
          return Promise.resolve(tpl);
        }
        return readFileAsync(filepath).then(function (str) {
          return _this3.parse(str);
        }).then(function (tpl) {
          return _this3.cache[filepath] = tpl;
        });
      } else {
        return readFileAsync(filepath).then(function (str) {
          return _this3.parse(str, filepath);
        });
      }
    });
  },
  express: function express(opts) {
    opts = opts || {};
    var self = this;
    return function (filePath, ctx, callback) {
      assert(Array.isArray(this.root) || _.isString(this.root), 'illegal views root, are you using express.js?');
      opts.root = this.root;
      self.renderFile(filePath, ctx, opts).then(function (html) {
        return callback(null, html);
      }).catch(function (e) {
        return callback(e);
      });
    };
  }
};

function factory(options) {
  options = _.assign({
    root: ['.'],
    cache: false,
    extname: '.liquid',
    trim_right: false,
    trim_left: false,
    strict_filters: false,
    strict_variables: false
  }, options);
  options.root = normalizeStringArray(options.root);

  var engine = Object.create(_engine);
  engine.init(Tag(), Filter(options), options);
  return engine;
}

function normalizeStringArray(value) {
  if (Array.isArray(value)) return value;
  if (_.isString(value)) return [value];
  return [];
}

factory.lexical = lexical;
factory.isTruthy = Syntax.isTruthy;
factory.isFalsy = Syntax.isFalsy;
factory.evalExp = Syntax.evalExp;
factory.evalValue = Syntax.evalValue;
factory.Types = {
  ParseError: Errors.ParseError,
  TokenizationEroor: Errors.TokenizationError,
  RenderBreakError: Errors.RenderBreakError,
  AssertionError: Errors.AssertionError
};

module.exports = factory;

},{"./filters":1,"./src/filter.js":7,"./src/lexical.js":8,"./src/parser":10,"./src/render.js":11,"./src/scope":12,"./src/syntax.js":13,"./src/tag.js":14,"./src/tokenizer.js":15,"./src/util/assert.js":16,"./src/util/error.js":17,"./src/util/fs.js":18,"./src/util/promise.js":19,"./src/util/underscore.js":21,"./tags":32,"any-promise":3,"path":6}],3:[function(require,module,exports){
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
'use strict';

var lexical = require('./lexical.js');
var Syntax = require('./syntax.js');
var assert = require('./util/assert.js');
var _ = require('./util/underscore.js');

var valueRE = new RegExp('' + lexical.value.source, 'g');

module.exports = function (options) {
  options = _.assign({}, options);
  var filters = {};

  var _filterInstance = {
    render: function render(output, scope) {
      var args = this.args.map(function (arg) {
        return Syntax.evalValue(arg, scope);
      });
      args.unshift(output);
      return this.filter.apply(null, args);
    },
    parse: function parse(str) {
      var match = lexical.filterLine.exec(str);
      assert(match, 'illegal filter: ' + str);

      var name = match[1];
      var argList = match[2] || '';
      var filter = filters[name];
      if (typeof filter !== 'function') {
        if (options.strict_filters) {
          throw new TypeError('undefined filter: ' + name);
        }
        this.name = name;
        this.filter = function (x) {
          return x;
        };
        this.args = [];
        return this;
      }

      var args = [];
      while (match = valueRE.exec(argList.trim())) {
        var v = match[0];
        var re = new RegExp(v + '\\s*:', 'g');
        re.test(match.input) ? args.push('\'' + v + '\'') : args.push(v);
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

},{"./lexical.js":8,"./syntax.js":13,"./util/assert.js":16,"./util/underscore.js":21}],8:[function(require,module,exports){
'use strict';

// quote related
var singleQuoted = /'[^']*'/;
var doubleQuoted = /"[^"]*"/;
var quoted = new RegExp(singleQuoted.source + '|' + doubleQuoted.source);
var quoteBalanced = new RegExp('(?:' + quoted.source + '|[^\'"])*');

// basic types
var integer = /-?\d+/;
var number = /-?\d+\.?\d*|\.?\d+/;
var bool = /true|false/;

// peoperty access
var identifier = /[\w-]+/;
var subscript = new RegExp('\\[(?:' + quoted.source + '|[\\w-\\.]+)\\]');
var literal = new RegExp('(?:' + quoted.source + '|' + bool.source + '|' + number.source + ')');
var variable = new RegExp(identifier.source + '(?:\\.' + identifier.source + '|' + subscript.source + ')*');

// range related
var rangeLimit = new RegExp('(?:' + variable.source + '|' + number.source + ')');
var range = new RegExp('\\(' + rangeLimit.source + '\\.\\.' + rangeLimit.source + '\\)');
var rangeCapture = new RegExp('\\((' + rangeLimit.source + ')\\.\\.(' + rangeLimit.source + ')\\)');

var value = new RegExp('(?:' + variable.source + '|' + literal.source + '|' + range.source + ')');

// hash related
var hash = new RegExp('(?:' + identifier.source + ')\\s*:\\s*(?:' + value.source + ')');
var hashCapture = new RegExp('(' + identifier.source + ')\\s*:\\s*(' + value.source + ')', 'g');

// full match
var tagLine = new RegExp('^\\s*(' + identifier.source + ')\\s*([\\s\\S]*)\\s*$');
var literalLine = new RegExp('^' + literal.source + '$', 'i');
var variableLine = new RegExp('^' + variable.source + '$');
var numberLine = new RegExp('^' + number.source + '$');
var boolLine = new RegExp('^' + bool.source + '$', 'i');
var quotedLine = new RegExp('^' + quoted.source + '$');
var rangeLine = new RegExp('^' + rangeCapture.source + '$');
var integerLine = new RegExp('^' + integer.source + '$');

// filter related
var valueDeclaration = new RegExp('(?:' + identifier.source + '\\s*:\\s*)?' + value.source);
var valueList = new RegExp(valueDeclaration.source + '(\\s*,\\s*' + valueDeclaration.source + ')*');
var filter = new RegExp(identifier.source + '(?:\\s*:\\s*' + valueList.source + ')?', 'g');
var filterCapture = new RegExp('(' + identifier.source + ')(?:\\s*:\\s*(' + valueList.source + '))?');
var filterLine = new RegExp('^' + filterCapture.source + '$');

var operators = [/\s+or\s+/, /\s+and\s+/, /==|!=|<=|>=|<|>|\s+contains\s+/];

function isInteger(str) {
  return integerLine.test(str);
}

function isLiteral(str) {
  return literalLine.test(str);
}

function isRange(str) {
  return rangeLine.test(str);
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
}

module.exports = {
  quoted: quoted,
  number: number,
  bool: bool,
  literal: literal,
  filter: filter,
  integer: integer,
  hash: hash,
  hashCapture: hashCapture,
  range: range,
  rangeCapture: rangeCapture,
  identifier: identifier,
  value: value,
  quoteBalanced: quoteBalanced,
  operators: operators,
  quotedLine: quotedLine,
  numberLine: numberLine,
  boolLine: boolLine,
  rangeLine: rangeLine,
  literalLine: literalLine,
  filterLine: filterLine,
  tagLine: tagLine,
  isLiteral: isLiteral,
  isVariable: isVariable,
  parseLiteral: parseLiteral,
  isRange: isRange,
  matchValue: matchValue,
  isInteger: isInteger
};

},{}],9:[function(require,module,exports){
'use strict';

var operators = {
  '==': function _(l, r) {
    return l === r;
  },
  '!=': function _(l, r) {
    return l !== r;
  },
  '>': function _(l, r) {
    return l !== null && r !== null && l > r;
  },
  '<': function _(l, r) {
    return l !== null && r !== null && l < r;
  },
  '>=': function _(l, r) {
    return l !== null && r !== null && l >= r;
  },
  '<=': function _(l, r) {
    return l !== null && r !== null && l <= r;
  },
  'contains': function contains(l, r) {
    if (!l) return false;
    if (typeof l.indexOf !== 'function') return false;
    return l.indexOf(r) > -1;
  },
  'and': function and(l, r) {
    return l && r;
  },
  'or': function or(l, r) {
    return l || r;
  }
};

module.exports = operators;

},{}],10:[function(require,module,exports){
'use strict';

var lexical = require('./lexical.js');
var ParseError = require('./util/error.js').ParseError;
var assert = require('./util/assert.js');

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
        if (token.type === 'tag' && this.trigger('tag:' + token.name, token)) {
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
    var token;
    var templates = [];
    while (token = tokens.shift()) {
      templates.push(parseToken(token, tokens));
    }
    return templates;
  }

  function parseToken(token, tokens) {
    try {
      var tpl = null;
      if (token.type === 'tag') {
        tpl = parseTag(token, tokens);
      } else if (token.type === 'output') {
        tpl = parseOutput(token.value);
      } else {
        // token.type === 'html'
        tpl = token;
      }
      tpl.token = token;
      return tpl;
    } catch (e) {
      throw new ParseError(e, token);
    }
  }

  function parseTag(token, tokens) {
    if (token.name === 'continue' || token.name === 'break') return token;
    return Tag.construct(token, tokens);
  }

  function parseOutput(str) {
    var match = lexical.matchValue(str);
    assert(match, 'illegal output string: ' + str);

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
    parse: parse,
    parseTag: parseTag,
    parseStream: parseStream,
    parseOutput: parseOutput
  };
};

},{"./lexical.js":8,"./util/assert.js":16,"./util/error.js":17}],11:[function(require,module,exports){
'use strict';

var Syntax = require('./syntax.js');
var Promise = require('any-promise');
var mapSeries = require('./util/promise.js').mapSeries;
var RenderBreakError = require('./util/error.js').RenderBreakError;
var RenderError = require('./util/error.js').RenderError;
var assert = require('./util/assert.js');

var render = {

  renderTemplates: function renderTemplates(templates, scope) {
    var _this = this;

    assert(scope, 'unable to evalTemplates: scope undefined');

    var html = '';
    return mapSeries(templates, function (tpl) {
      return renderTemplate.call(_this, tpl).then(function (partial) {
        return html += partial;
      }).catch(function (e) {
        if (e instanceof RenderBreakError) {
          e.resolvedHTML = html;
          throw e;
        }
        throw new RenderError(e, tpl);
      });
    }).then(function () {
      return html;
    });

    function renderTemplate(template) {
      var _this2 = this;

      if (template.type === 'tag') {
        return this.renderTag(template, scope).then(function (partial) {
          return partial === undefined ? '' : partial;
        });
      } else if (template.type === 'output') {
        return Promise.resolve().then(function () {
          return _this2.evalOutput(template, scope);
        }).then(function (partial) {
          return partial === undefined ? '' : stringify(partial);
        });
      } else {
        // template.type === 'html'
        return Promise.resolve(template.value);
      }
    }
  },

  renderTag: function renderTag(template, scope) {
    if (template.name === 'continue') {
      return Promise.reject(new RenderBreakError('continue'));
    }
    if (template.name === 'break') {
      return Promise.reject(new RenderBreakError('break'));
    }
    return template.render(scope);
  },

  evalOutput: function evalOutput(template, scope) {
    assert(scope, 'unable to evalOutput: scope undefined');
    return template.filters.reduce(function (prev, filter) {
      return filter.render(prev, scope);
    }, Syntax.evalExp(template.initial, scope));
  }
};

function factory() {
  var instance = Object.create(render);
  return instance;
}

function stringify(val) {
  if (typeof val === 'string') return val;
  return JSON.stringify(val);
}

module.exports = factory;

},{"./syntax.js":13,"./util/assert.js":16,"./util/error.js":17,"./util/promise.js":19,"any-promise":3}],12:[function(require,module,exports){
'use strict';

var _ = require('./util/underscore.js');
var lexical = require('./lexical.js');
var assert = require('./util/assert.js');
var toStr = Object.prototype.toString;

var Scope = {
  getAll: function getAll() {
    var ctx = {};
    for (var i = this.scopes.length - 1; i >= 0; i--) {
      _.assign(ctx, this.scopes[i]);
    }
    return ctx;
  },
  get: function get(str) {
    for (var i = this.scopes.length - 1; i >= 0; i--) {
      try {
        return this.getPropertyByPath(this.scopes[i], str);
      } catch (e) {
        if (/undefined variable/.test(e.message)) {
          continue;
        }
        if (/Cannot read property/.test(e.message)) {
          if (this.opts.strict_variables) {
            e.message += ': ' + str;
            throw e;
          } else {
            continue;
          }
        } else {
          e.message += ': ' + str;
          throw e;
        }
      }
    }
    if (this.opts.strict_variables) {
      throw new TypeError('undefined variable: ' + str);
    }
  },
  set: function set(k, v) {
    this.setPropertyByPath(this.scopes[this.scopes.length - 1], k, v);
    return this;
  },
  push: function push(ctx) {
    assert(ctx, 'trying to push ' + ctx + ' into scopes');
    return this.scopes.push(ctx);
  },
  pop: function pop() {
    return this.scopes.pop();
  },
  unshift: function unshift(ctx) {
    assert(ctx, 'trying to push ' + ctx + ' into scopes');
    return this.scopes.unshift(ctx);
  },
  shift: function shift() {
    return this.scopes.shift();
  },
  setPropertyByPath: function setPropertyByPath(obj, path, val) {
    if (_.isString(path)) {
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
    }
  },

  getPropertyByPath: function getPropertyByPath(obj, path) {
    var paths = this.propertyAccessSeq(path + '');
    var varName = paths.shift();
    if (!obj.hasOwnProperty(varName)) {
      throw new TypeError('undefined variable');
    }
    var variable = obj[varName];
    var lastName = paths.pop();
    paths.forEach(function (p) {
      return variable = variable[p];
    });
    if (undefined !== lastName) {
      if (lastName === 'size' && (toStr.call(variable) === '[object Array]' || toStr.call(variable) === '[object String]')) {
        return variable.length;
      }
      variable = variable[lastName];
    }
    return variable;
  },

  /*
   * Parse property access sequence from access string
   * @example
   * accessSeq("foo.bar")            // ['foo', 'bar']
   * accessSeq("foo['bar']")      // ['foo', 'bar']
   * accessSeq("foo['b]r']")      // ['foo', 'b]r']
   * accessSeq("foo[bar.coo]")    // ['foo', 'bar'], for bar.coo == 'bar'
   */
  propertyAccessSeq: function propertyAccessSeq(str) {
    var seq = [];
    var name = '';
    for (var i = 0; i < str.length; i++) {
      if (str[i] === '[') {
        seq.push(name);
        name = '';

        var delemiter = str[i + 1];
        if (delemiter !== "'" && delemiter !== '"') {
          // foo[bar.coo]
          var j = matchRightBracket(str, i + 1);
          assert(j !== -1, 'unbalanced []: ' + str);
          name = str.slice(i + 1, j);
          if (lexical.isInteger(name)) {
            // foo[1]
            seq.push(name);
          } else {
            // foo["bar"]
            seq.push(this.get(name));
          }
          name = '';
          i = j;
        } else {
          // foo["bar"]
          j = str.indexOf(delemiter, i + 2);
          assert(j !== -1, 'unbalanced ' + delemiter + ': ' + str);
          name = str.slice(i + 2, j);
          seq.push(name);
          name = '';
          i = j + 2;
        }
      } else if (str[i] === '.') {
        // foo.bar
        seq.push(name);
        name = '';
      } else {
        // foo.bar
        name += str[i];
      }
    }
    if (name.length) seq.push(name);
    return seq;
  }
};

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

exports.factory = function (ctx, opts) {
  opts = _.assign({
    strict_variables: false,
    strict_filters: false,
    blocks: {},
    root: []
  }, opts);

  ctx = _.assign(ctx, {
    liquid: opts
  });

  var scope = Object.create(Scope);
  scope.opts = opts;
  scope.scopes = [ctx];
  return scope;
};

},{"./lexical.js":8,"./util/assert.js":16,"./util/underscore.js":21}],13:[function(require,module,exports){
'use strict';

var operators = require('./operators.js');
var lexical = require('./lexical.js');
var assert = require('../src/util/assert.js');

function evalExp(exp, scope) {
  assert(scope, 'unable to evalExp: scope undefined');
  var operatorREs = lexical.operators;
  var match;
  for (var i = 0; i < operatorREs.length; i++) {
    var operatorRE = operatorREs[i];
    var expRE = new RegExp('^(' + lexical.quoteBalanced.source + ')(' + operatorRE.source + ')(' + lexical.quoteBalanced.source + ')$');
    if (match = exp.match(expRE)) {
      var l = evalExp(match[1], scope);
      var op = operators[match[2].trim()];
      var r = evalExp(match[3], scope);
      return op(l, r);
    }
  }

  if (match = exp.match(lexical.rangeLine)) {
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
  if (!str) return undefined;

  if (lexical.isLiteral(str)) {
    return lexical.parseLiteral(str);
  }
  if (lexical.isVariable(str)) {
    return scope.get(str);
  }
}

function isTruthy(val) {
  return !isFalsy(val);
}

function isFalsy(val) {
  return val === false || undefined === val || val === null;
}

module.exports = {
  evalExp: evalExp, evalValue: evalValue, isTruthy: isTruthy, isFalsy: isFalsy
};

},{"../src/util/assert.js":16,"./lexical.js":8,"./operators.js":9}],14:[function(require,module,exports){
'use strict';

var lexical = require('./lexical.js');
var _ = require('./util/underscore.js');
var Promise = require('any-promise');
var Syntax = require('./syntax.js');
var assert = require('./util/assert.js');

function hash(markup, scope) {
  var obj = {};
  var match;
  lexical.hashCapture.lastIndex = 0;
  while (match = lexical.hashCapture.exec(markup)) {
    var k = match[1];
    var v = match[2];
    obj[k] = Syntax.evalValue(v, scope);
  }
  return obj;
}

module.exports = function () {
  var tagImpls = {};

  var _tagInstance = {
    render: function render(scope) {
      var obj = hash(this.token.args, scope);
      var impl = this.tagImpl;
      if (typeof impl.render !== 'function') {
        return Promise.resolve('');
      }
      return Promise.resolve().then(function () {
        return typeof impl.render === 'function' ? impl.render(scope, obj) : '';
      }).catch(function (e) {
        if (_.isError(e)) {
          throw e;
        }
        var msg = 'Please reject with an Error in ' + impl.render + ', got ' + e;
        throw new Error(msg);
      });
    },
    parse: function parse(token, tokens) {
      this.type = 'tag';
      this.token = token;
      this.name = token.name;

      var tagImpl = tagImpls[this.name];
      assert(tagImpl, 'tag ' + this.name + ' not found');
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
    construct: construct,
    register: register,
    clear: clear
  };
};

},{"./lexical.js":8,"./syntax.js":13,"./util/assert.js":16,"./util/underscore.js":21,"any-promise":3}],15:[function(require,module,exports){
'use strict';

var lexical = require('./lexical.js');
var TokenizationError = require('./util/error.js').TokenizationError;
var _ = require('./util/underscore.js');
var assert = require('../src/util/assert.js');

function parse(html, filepath, options) {
  assert(_.isString(html), 'illegal input type');

  html = whiteSpaceCtrl(html, options);

  var tokens = [];
  var syntax = /({%-?([\s\S]*?)-?%})|({{([\s\S]*?)}})/g;
  var result, htmlFragment, token;
  var lastMatchEnd = 0;
  var lastMatchBegin = -1;
  var parsedLinesCount = 0;

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
    if (result[1]) {
      // tag appeared
      token = factory('tag', 1, result);

      var match = token.value.match(lexical.tagLine);
      if (!match) {
        throw new TokenizationError('illegal tag syntax', token);
      }
      token.name = match[1];
      token.args = match[2];

      tokens.push(token);
    } else {
      // output
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
      input: html,
      file: filepath
    };
  }

  function getLineNum(match) {
    var lines = match.input.slice(lastMatchBegin + 1, match.index).split('\n');
    parsedLinesCount += lines.length - 1;
    lastMatchBegin = match.index;
    return parsedLinesCount + 1;
  }
}

function whiteSpaceCtrl(html, options) {
  options = options || {};
  if (options.trim_left) {
    html = html.replace(/{%-?/g, '{%-');
  }
  if (options.trim_right) {
    html = html.replace(/-?%}/g, '-%}');
  }
  var rLeft = options.greedy ? /\s+({%-)/g : /[\t\r ]*({%-)/g;
  var rRight = options.greedy ? /(-%})\s+/g : /(-%})[\t\r ]*\n?/g;
  return html.replace(rLeft, '$1').replace(rRight, '$1');
}

exports.parse = parse;
exports.whiteSpaceCtrl = whiteSpaceCtrl;

},{"../src/util/assert.js":16,"./lexical.js":8,"./util/error.js":17,"./util/underscore.js":21}],16:[function(require,module,exports){
'use strict';

var AssertionError = require('./error.js').AssertionError;

function assert(predicate, message) {
  if (!predicate) {
    if (message instanceof Error) {
      throw message;
    }
    message = message || 'expect ' + predicate + ' to be true';
    throw new AssertionError(message);
  }
}

module.exports = assert;

},{"./error.js":17}],17:[function(require,module,exports){
'use strict';

var _ = require('./underscore.js');

function TokenizationError(message, token) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
  this.name = this.constructor.name;

  this.input = token.input;
  this.line = token.line;
  this.file = token.file;

  var context = mkContext(token.input, token.line);
  this.message = mkMessage(message, token);
  this.stack = context + '\n' + (this.stack || '');
}
TokenizationError.prototype = Object.create(Error.prototype);
TokenizationError.prototype.constructor = TokenizationError;

function ParseError(e, token) {
  _.assign(this, e);
  this.originalError = e;
  this.name = this.constructor.name;

  this.input = token.input;
  this.line = token.line;
  this.file = token.file;

  var context = mkContext(token.input, token.line);
  this.message = mkMessage(e.message || 'Unkown Error', token);
  this.stack = context + '\n' + (e.stack || '');
}
ParseError.prototype = Object.create(Error.prototype);
ParseError.prototype.constructor = ParseError;

function RenderError(e, tpl) {
  // return the original render error
  if (e instanceof RenderError) {
    return e;
  }
  _.assign(this, e);
  this.originalError = e;
  this.name = this.constructor.name;

  this.input = tpl.token.input;
  this.line = tpl.token.line;
  this.file = tpl.token.file;

  var context = mkContext(tpl.token.input, tpl.token.line);
  this.message = mkMessage(e.message || 'Unkown Error', tpl.token);
  this.stack = context + '\n' + (e.stack || '');
}
RenderError.prototype = Object.create(Error.prototype);
RenderError.prototype.constructor = RenderError;

function RenderBreakError(message) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
  this.name = this.constructor.name;
  this.message = message || '';
}
RenderBreakError.prototype = Object.create(Error.prototype);
RenderBreakError.prototype.constructor = RenderBreakError;

function AssertionError(message) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
  this.name = this.constructor.name;
  this.message = message;
}
AssertionError.prototype = Object.create(Error.prototype);
AssertionError.prototype.constructor = AssertionError;

function mkContext(input, line) {
  var lines = input.split('\n');
  var begin = Math.max(line - 2, 1);
  var end = Math.min(line + 3, lines.length);

  var context = _.range(begin, end + 1).map(function (l) {
    return [l === line ? '>> ' : '   ', align(l, end), '| ', lines[l - 1]].join('');
  }).join('\n');

  return context;
}

function align(n, max) {
  var length = (max + '').length;
  var str = n + '';
  var blank = Array(length - str.length).join(' ');
  return blank + str;
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

module.exports = {
  TokenizationError: TokenizationError,
  ParseError: ParseError,
  RenderBreakError: RenderBreakError,
  AssertionError: AssertionError,
  RenderError: RenderError
};

},{"./underscore.js":21}],18:[function(require,module,exports){
'use strict';

var fs = require('fs');

function readFileAsync(filepath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filepath, 'utf8', function (err, content) {
      err ? reject(err) : resolve(content);
    });
  });
};

function statFileAsync(path) {
  return new Promise(function (resolve, reject) {
    fs.stat(path, function (err, stat) {
      return err ? reject(err) : resolve(stat);
    });
  });
};

module.exports = {
  readFileAsync: readFileAsync,
  statFileAsync: statFileAsync
};

},{"fs":6}],19:[function(require,module,exports){
'use strict';

var Promise = require('any-promise');

/*
 * Call functions in serial until someone resolved.
 * @param {Array} iterable the array to iterate with.
 * @param {Array} iteratee returns a new promise.
 * The iteratee is invoked with three arguments: (value, index, iterable).
 */
function anySeries(iterable, iteratee) {
  var ret = Promise.reject(new Error('init'));
  iterable.forEach(function (item, idx) {
    ret = ret.catch(function (e) {
      return iteratee(item, idx, iterable);
    });
  });
  return ret;
}

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
    ret = ret.then(function () {
      return iteratee(item, idx, iterable);
    }).then(function (x) {
      return result.push(x);
    });
  });
  return ret.then(function () {
    return result;
  });
}

exports.anySeries = anySeries;
exports.mapSeries = mapSeries;

},{"any-promise":3}],20:[function(require,module,exports){
'use strict';

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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

  getSuffix: function getSuffix(d) {
    var str = d.getDate().toString();
    var index = parseInt(str.slice(-1));
    return suffixes[index] || suffixes['default'];
  },

  century: function century(d) {
    return parseInt(d.getFullYear().toString().substring(0, 2), 10);
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

var formatCodes = {
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
  z: function z(d) {
    var tz = d.getTimezoneOffset() / 60 * 100;
    return (tz > 0 ? '-' : '+') + _number.pad(Math.abs(tz), 4);
  },
  '%': function _() {
    return '%';
  }
};
formatCodes.h = formatCodes.b;
formatCodes.N = formatCodes.L;

var strftime = function strftime(d, format) {
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
};

module.exports = strftime;

},{}],21:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*
 * Checks if value is classified as a String primitive or object.
 * @param {any} value The value to check.
 * @return {Boolean} Returns true if value is a string, else false.
 */
function isString(value) {
  return value instanceof String || typeof value === 'string';
}

function isError(value) {
  var signature = Object.prototype.toString.call(value);
  // [object XXXError]
  return signature.substr(-6, 5) === 'Error' || typeof value.message === 'string' && typeof value.name === 'string';
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
      if (iteratee(object[k], k, object) === false) break;
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
function assign(object) {
  object = isObject(object) ? object : {};
  var srcs = Array.prototype.slice.call(arguments, 1);
  srcs.forEach(function (src) {
    _assignBinary(object, src);
  });
  return object;
}

function _assignBinary(dst, src) {
  if (!dst) return dst;
  forOwn(src, function (v, k) {
    dst[k] = v;
  });
  return dst;
}

function echo(prefix) {
  return function (v) {
    console.log('[' + prefix + ']', v);
    return v;
  };
}

function uniq(arr) {
  var u = {};
  var a = [];
  for (var i = 0, l = arr.length; i < l; ++i) {
    if (u.hasOwnProperty(arr[i])) {
      continue;
    }
    a.push(arr[i]);
    u[arr[i]] = 1;
  }
  return a;
}

/*
 * Checks if value is the language type of Object.
 * (e.g. arrays, functions, objects, regexes, new Number(0), and new String(''))
 * @param {any} value The value to check.
 * @return {Boolean} Returns true if value is an object, else false.
 */
function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return value != null && (type === 'object' || type === 'function');
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

exports.isString = isString;
exports.isObject = isObject;
exports.isError = isError;

exports.range = range;

exports.forOwn = forOwn;
exports.assign = assign;
exports.uniq = uniq;

exports.echo = echo;

},{}],22:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;
var Promise = require('any-promise');
var re = new RegExp('(' + lexical.identifier.source + ')\\s*=(.*)');
var assert = require('../src/util/assert.js');

module.exports = function (liquid) {

    liquid.registerTag('assign', {
        parse: function parse(token) {
            var match = token.args.match(re);
            assert(match, 'illegal token ' + token.raw);
            this.key = match[1];
            this.value = match[2];
        },
        render: function render(scope) {
            scope.set(this.key, liquid.evalOutput(this.value, scope));
            return Promise.resolve('');
        }
    });
};

},{"..":2,"../src/util/assert.js":16,"any-promise":3}],23:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;
var re = new RegExp('(' + lexical.identifier.source + ')');
var assert = require('../src/util/assert.js');

module.exports = function (liquid) {

    liquid.registerTag('capture', {
        parse: function parse(tagToken, remainTokens) {
            var _this = this;

            var match = tagToken.args.match(re);
            assert(match, tagToken.args + ' not valid identifier');

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

},{"..":2,"../src/util/assert.js":16}],24:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var assert = require('../src/util/assert.js');

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

},{"..":2,"../src/util/assert.js":16}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var Promise = require('any-promise');
var lexical = Liquid.lexical;
var groupRE = new RegExp('^(?:(' + lexical.value.source + ')\\s*:\\s*)?(.*)$');
var candidatesRE = new RegExp(lexical.value.source, 'g');
var assert = require('../src/util/assert.js');

module.exports = function (liquid) {
    liquid.registerTag('cycle', {

        parse: function parse(tagToken, remainTokens) {
            var match = groupRE.exec(tagToken.args);
            assert(match, 'illegal tag: ' + tagToken.raw);

            this.group = match[1] || '';
            var candidates = match[2];

            this.candidates = [];

            while (match = candidatesRE.exec(candidates)) {
                this.candidates.push(match[0]);
            }

            assert(this.candidates.length, 'empty candidates: ' + tagToken.raw);
        },

        render: function render(scope, hash) {
            var group = Liquid.evalValue(this.group, scope);
            var fingerprint = 'cycle:' + group + ':' + this.candidates.join(',');
            var register = scope.get('liquid');
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

},{"..":2,"../src/util/assert.js":16,"any-promise":3}],27:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;
var assert = require('../src/util/assert.js');

module.exports = function (liquid) {

    liquid.registerTag('decrement', {
        parse: function parse(token) {
            var match = token.args.match(lexical.identifier);
            assert(match, 'illegal identifier ' + token.args);
            this.variable = match[0];
        },
        render: function render(scope, hash) {
            var v = scope.get(this.variable);
            if (typeof v !== 'number') v = 0;
            scope.set(this.variable, v - 1);
        }
    });
};

},{"..":2,"../src/util/assert.js":16}],28:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;
var mapSeries = require('../src/util/promise.js').mapSeries;
var _ = require('../src/util/underscore.js');
var RenderBreakError = Liquid.Types.RenderBreakError;
var assert = require('../src/util/assert.js');
var re = new RegExp('^(' + lexical.identifier.source + ')\\s+in\\s+' + ('(' + lexical.value.source + ')') + ('(?:\\s+' + lexical.hash.source + ')*') + '(?:\\s+(reversed))?' + ('(?:\\s+' + lexical.hash.source + ')*$'));

module.exports = function (liquid) {
  liquid.registerTag('for', {

    parse: function parse(tagToken, remainTokens) {
      var _this = this;

      var match = re.exec(tagToken.args);
      assert(match, 'illegal tag: ' + tagToken.raw);
      this.variable = match[1];
      this.collection = match[2];
      this.reversed = !!match[3];

      this.templates = [];
      this.elseTemplates = [];

      var p;
      var stream = liquid.parser.parseStream(remainTokens).on('start', function () {
        return p = _this.templates;
      }).on('tag:else', function () {
        return p = _this.elseTemplates;
      }).on('tag:endfor', function () {
        return stream.stop();
      }).on('template', function (tpl) {
        return p.push(tpl);
      }).on('end', function () {
        throw new Error('tag ' + tagToken.raw + ' not closed');
      });

      stream.start();
    },

    render: function render(scope, hash) {
      var _this2 = this;

      var collection = Liquid.evalExp(this.collection, scope);

      if (!Array.isArray(collection)) {
        if (_.isString(collection) && collection.length > 0) {
          collection = [collection];
        } else if (_.isObject(collection)) {
          collection = Object.keys(collection);
        }
      }
      if (!Array.isArray(collection) || !collection.length) {
        return liquid.renderer.renderTemplates(this.elseTemplates, scope);
      }

      var length = collection.length;
      var offset = hash.offset || 0;
      var limit = hash.limit === undefined ? collection.length : hash.limit;

      collection = collection.slice(offset, offset + limit);
      if (this.reversed) collection.reverse();

      var contexts = collection.map(function (item, i) {
        var ctx = {};
        ctx[_this2.variable] = item;
        ctx.forloop = {
          first: i === 0,
          index: i + 1,
          index0: i,
          last: i === length - 1,
          length: length,
          rindex: length - i,
          rindex0: length - i - 1
        };
        return ctx;
      });

      var html = '';
      return mapSeries(contexts, function (context) {
        scope.push(context);
        return liquid.renderer.renderTemplates(_this2.templates, scope).then(function (partial) {
          return html += partial;
        }).catch(function (e) {
          if (e instanceof RenderBreakError) {
            html += e.resolvedHTML;
            if (e.message === 'continue') return;
          }
          throw e;
        }).then(function () {
          return scope.pop();
        });
      }).catch(function (e) {
        if (e instanceof RenderBreakError && e.message === 'break') {
          return;
        }
        throw e;
      }).then(function () {
        return html;
      });
    }
  });
};

},{"..":2,"../src/util/assert.js":16,"../src/util/promise.js":19,"../src/util/underscore.js":21}],29:[function(require,module,exports){
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

},{"..":2}],30:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;
var withRE = new RegExp('with\\s+(' + lexical.value.source + ')');
var assert = require('../src/util/assert.js');

module.exports = function (liquid) {

    liquid.registerTag('include', {
        parse: function parse(token) {
            var match = lexical.value.exec(token.args);
            assert(match, 'illegal token ' + token.raw);
            this.value = match[0];

            match = withRE.exec(token.args);
            if (match) {
                this.with = match[1];
            }
        },
        render: function render(scope, hash) {
            var filepath = Liquid.evalValue(this.value, scope);

            var register = scope.get('liquid');
            var originBlocks = register.blocks;
            register.blocks = {};

            if (this.with) {
                hash[filepath] = Liquid.evalValue(this.with, scope);
            }
            return liquid.getTemplate(filepath, register.root).then(function (templates) {
                scope.push(hash);
                return liquid.renderer.renderTemplates(templates, scope);
            }).then(function (html) {
                scope.pop();
                register.blocks = originBlocks;
                return html;
            });
        }
    });
};

},{"..":2,"../src/util/assert.js":16}],31:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var assert = require('../src/util/assert.js');
var lexical = Liquid.lexical;

module.exports = function (liquid) {

    liquid.registerTag('increment', {
        parse: function parse(token) {
            var match = token.args.match(lexical.identifier);
            assert(match, 'illegal identifier ' + token.args);
            this.variable = match[0];
        },
        render: function render(scope, hash) {
            var v = scope.get(this.variable);
            if (typeof v !== 'number') v = 0;
            scope.set(this.variable, v + 1);
        }
    });
};

},{"..":2,"../src/util/assert.js":16}],32:[function(require,module,exports){
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

},{"./assign.js":22,"./capture.js":23,"./case.js":24,"./comment.js":25,"./cycle.js":26,"./decrement.js":27,"./for.js":28,"./if.js":29,"./include.js":30,"./increment.js":31,"./layout.js":33,"./raw.js":34,"./tablerow.js":35,"./unless.js":36}],33:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var Promise = require('any-promise');
var lexical = Liquid.lexical;
var assert = require('../src/util/assert.js');

module.exports = function (liquid) {

    liquid.registerTag('layout', {
        parse: function parse(token, remainTokens) {
            var match = lexical.value.exec(token.args);
            assert(match, 'illegal token ' + token.raw);

            this.layout = match[0];
            this.tpls = liquid.parser.parse(remainTokens);
        },
        render: function render(scope, hash) {
            var layout = Liquid.evalValue(this.layout, scope);
            var register = scope.get('liquid');

            // render the remaining tokens immediately
            return liquid.renderer.renderTemplates(this.tpls, scope)
            // now register.blocks contains rendered blocks
            .then(function () {
                return liquid.getTemplate(layout, register.root);
            })
            // push the hash
            .then(function (templates) {
                return scope.push(hash), templates;
            })
            // render the parent
            .then(function (templates) {
                return liquid.renderer.renderTemplates(templates, scope);
            })
            // pop the hash
            .then(function (partial) {
                return scope.pop(), partial;
            });
        }
    });

    liquid.registerTag('block', {
        parse: function parse(token, remainTokens) {
            var _this = this;

            var match = /\w+/.exec(token.args);
            this.block = match ? match[0] : 'anonymous';

            this.tpls = [];
            var stream = liquid.parser.parseStream(remainTokens).on('tag:endblock', function () {
                return stream.stop();
            }).on('template', function (tpl) {
                return _this.tpls.push(tpl);
            }).on('end', function () {
                throw new Error('tag ' + token.raw + ' not closed');
            });
            stream.start();
        },
        render: function render(scope) {
            var _this2 = this;

            var register = scope.get('liquid');
            var html = register.blocks[this.block];
            // if not defined yet
            if (html === undefined) {
                return liquid.renderer.renderTemplates(this.tpls, scope).then(function (partial) {
                    register.blocks[_this2.block] = partial;
                    return partial;
                });
            }
            // if already defined by desendents
            else {
                    register.blocks[this.block] = html;
                    return Promise.resolve(html);
                }
        }
    });
};

},{"..":2,"../src/util/assert.js":16,"any-promise":3}],34:[function(require,module,exports){
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

},{"any-promise":3}],35:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var Promise = require('any-promise');
var lexical = Liquid.lexical;
var assert = require('../src/util/assert.js');
var re = new RegExp('^(' + lexical.identifier.source + ')\\s+in\\s+' + ('(' + lexical.value.source + ')') + ('(?:\\s+' + lexical.hash.source + ')*$'));

module.exports = function (liquid) {
    liquid.registerTag('tablerow', {

        parse: function parse(tagToken, remainTokens) {
            var _this = this;

            var match = re.exec(tagToken.args);
            assert(match, 'illegal tag: ' + tagToken.raw);
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

},{"..":2,"../src/util/assert.js":16,"any-promise":3}],36:[function(require,module,exports){
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