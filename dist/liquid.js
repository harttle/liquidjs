(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Liquid = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
  'concat': function concat(v, arg) {
    return Array.prototype.concat.call(v, arg);
  },
  'date': function date(v, arg) {
    var date = v;
    if (v === 'now') {
      date = new Date();
    } else if (_.isString(v)) {
      date = new Date(v);
    }
    return isValidDate(date) ? strftime(date, arg) : v;
  },
  'default': function _default(v, arg) {
    return isTruthy(v) ? v : arg;
  },
  'divided_by': function divided_by(v, arg) {
    return v / arg;
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
    return _.last(v);
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
    return stringify(v).replace(/<script.*?<\/script>|<!--.*?-->|<style.*?<\/style>|<.*?>/g, '');
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
  var p = (v + '').split('.');
  return p.length > 1 ? p[1].length : 0;
}

function getMaxFixed(l, r) {
  return Math.max(getFixed(l), getFixed(r));
}

function stringify(obj) {
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

function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}

registerAll.filters = filters;
module.exports = registerAll;

},{"./src/syntax.js":12,"./src/util/strftime.js":19,"./src/util/underscore.js":20}],2:[function(require,module,exports){
'use strict';

var Scope = require('./src/scope');
var _ = require('./src/util/underscore.js');
var assert = require('./src/util/assert.js');
var tokenizer = require('./src/tokenizer.js');
var statFileAsync = require('./src/util/fs.js').statFileAsync;
var readFileAsync = require('./src/util/fs.js').readFileAsync;
var path = require('path');
var url = require('./src/util/url.js');
var Render = require('./src/render.js');
var lexical = require('./src/lexical.js');
var Tag = require('./src/tag.js');
var Filter = require('./src/filter.js');
var Parser = require('./src/parser');
var Syntax = require('./src/syntax.js');
var tags = require('./tags');
var filters = require('./filters');
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
    });
  },
  renderFile: function renderFile(filepath, ctx, opts) {
    var _this2 = this;

    opts = _.assign({}, opts);
    return this.getTemplate(filepath, opts.root).then(function (templates) {
      return _this2.render(templates, ctx, opts);
    });
  },
  evalValue: function evalValue(str, scope) {
    var tpl = this.parser.parseValue(str.trim());
    return this.renderer.evalValue(tpl, scope);
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
      e.message = e.code + ': Failed to lookup ' + filepath + ' in: ' + root;
      throw e;
    });
  },
  getTemplate: function getTemplate(filepath, root) {
    return typeof XMLHttpRequest === 'undefined' ? this.getTemplateFromFile(filepath, root) : this.getTemplateFromUrl(filepath, root);
  },
  getTemplateFromFile: function getTemplateFromFile(filepath, root) {
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
  getTemplateFromUrl: function getTemplateFromUrl(filepath, root) {
    var _this4 = this;

    var fullUrl;
    if (url.valid(filepath)) {
      fullUrl = filepath;
    } else {
      if (!url.extname(filepath)) {
        filepath += this.options.extname;
      }
      fullUrl = url.resolve(root || this.options.root, filepath);
    }
    if (this.options.cache) {
      var tpl = this.cache[filepath];
      if (tpl) {
        return Promise.resolve(tpl);
      }
    }
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          var tpl = _this4.parse(xhr.responseText);
          if (_this4.options.cache) {
            _this4.cache[filepath] = tpl;
          }
          resolve(tpl);
        } else {
          reject(new Error(xhr.statusText));
        }
      };
      xhr.onerror = function () {
        reject(new Error('An error occurred whilst sending the response.'));
      };
      xhr.open('GET', fullUrl);
      xhr.send();
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

},{"./filters":1,"./src/filter.js":6,"./src/lexical.js":7,"./src/parser":9,"./src/render.js":10,"./src/scope":11,"./src/syntax.js":12,"./src/tag.js":13,"./src/tokenizer.js":14,"./src/util/assert.js":15,"./src/util/error.js":16,"./src/util/fs.js":17,"./src/util/promise.js":18,"./src/util/underscore.js":20,"./src/util/url.js":21,"./tags":33,"path":4}],3:[function(require,module,exports){
"use strict";

},{}],4:[function(require,module,exports){
"use strict";

},{}],5:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

void function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object") {
    module.exports = factory();
  } else {
    root.resolveUrl = factory();
  }
}(undefined, function () {

  function resolveUrl() /* ...urls */{
    var numUrls = arguments.length;

    if (numUrls === 0) {
      throw new Error("resolveUrl requires at least one argument; got none.");
    }

    var base = document.createElement("base");
    base.href = arguments[0];

    if (numUrls === 1) {
      return base.href;
    }

    var head = document.getElementsByTagName("head")[0];
    head.insertBefore(base, head.firstChild);

    var a = document.createElement("a");
    var resolved;

    for (var index = 1; index < numUrls; index++) {
      a.href = arguments[index];
      resolved = a.href;
      base.href = resolved;
    }

    head.removeChild(base);

    return resolved;
  }

  return resolveUrl;
});

},{}],6:[function(require,module,exports){
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
        var keyMatch = re.exec(match.input);
        var currentMatchIsKey = keyMatch && keyMatch.index === match.index;
        currentMatchIsKey ? args.push('\'' + v + '\'') : args.push(v);
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

},{"./lexical.js":7,"./syntax.js":12,"./util/assert.js":15,"./util/underscore.js":20}],7:[function(require,module,exports){
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
var identifier = /[\w-]+[?]?/;
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
  throw new TypeError('cannot parse \'' + str + '\' as literal');
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

},{}],8:[function(require,module,exports){
'use strict';

module.exports = function (isTruthy) {
  return {
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
      return isTruthy(l) && isTruthy(r);
    },
    'or': function or(l, r) {
      return isTruthy(l) || isTruthy(r);
    }
  };
};

},{}],9:[function(require,module,exports){
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
      } else if (token.type === 'value') {
        tpl = parseValue(token.value);
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

  function parseValue(str) {
    var match = lexical.matchValue(str);
    assert(match, 'illegal value string: ' + str);

    var initial = match[0];
    str = str.substr(match.index + match[0].length);

    var filters = [];
    while (match = lexical.filter.exec(str)) {
      filters.push([match[0].trim()]);
    }

    return {
      type: 'value',
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
    parseValue: parseValue
  };
};

},{"./lexical.js":7,"./util/assert.js":15,"./util/error.js":16}],10:[function(require,module,exports){
'use strict';

var Syntax = require('./syntax.js');
var mapSeries = require('./util/promise.js').mapSeries;
var RenderBreakError = require('./util/error.js').RenderBreakError;
var _ = require('./util/underscore.js');
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
      if (template.type === 'tag') {
        return this.renderTag(template, scope).then(function (partial) {
          return partial === undefined ? '' : partial;
        });
      } else if (template.type === 'value') {
        return this.renderValue(template, scope);
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

  renderValue: function renderValue(template, scope) {
    var _this2 = this;

    return Promise.resolve().then(function () {
      return _this2.evalValue(template, scope);
    }).then(function (partial) {
      return partial === undefined ? '' : _.stringify(partial);
    });
  },

  evalValue: function evalValue(template, scope) {
    assert(scope, 'unable to evalValue: scope undefined');
    return template.filters.reduce(function (prev, filter) {
      return filter.render(prev, scope);
    }, Syntax.evalExp(template.initial, scope));
  }
};

function factory() {
  var instance = Object.create(render);
  return instance;
}

module.exports = factory;

},{"./syntax.js":12,"./util/assert.js":15,"./util/error.js":16,"./util/promise.js":18,"./util/underscore.js":20}],11:[function(require,module,exports){
'use strict';

var _ = require('./util/underscore.js');
var lexical = require('./lexical.js');
var assert = require('./util/assert.js');

var Scope = {
  getAll: function getAll() {
    return this.contexts.reduce(function (ctx, val) {
      return Object.assign(ctx, val);
    }, Object.create(null));
  },
  get: function get(path) {
    var _this = this;

    var paths = this.propertyAccessSeq(path);
    var scope = this.findContextFor(paths[0]) || _.last(this.contexts);
    return paths.reduce(function (value, key) {
      return _this.readProperty(value, key);
    }, scope);
  },
  set: function set(path, v) {
    var paths = this.propertyAccessSeq(path);
    var scope = this.findContextFor(paths[0]) || _.last(this.contexts);
    paths.some(function (key, i) {
      if (!_.isObject(scope)) {
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
  },
  unshift: function unshift(ctx) {
    return this.contexts.unshift(ctx);
  },
  push: function push(ctx) {
    return this.contexts.push(ctx);
  },
  pop: function pop(ctx) {
    if (!arguments.length) {
      return this.contexts.pop();
    }
    var i = this.contexts.findIndex(function (scope) {
      return scope === ctx;
    });
    if (i === -1) {
      throw new TypeError('scope not found, cannot pop');
    }
    return this.contexts.splice(i, 1)[0];
  },
  findContextFor: function findContextFor(key, filter) {
    filter = filter || function () {
      return true;
    };
    for (var i = this.contexts.length - 1; i >= 0; i--) {
      var candidate = this.contexts[i];
      if (!filter(candidate)) continue;
      if (key in candidate) {
        return candidate;
      }
    }
    return null;
  },
  readProperty: function readProperty(obj, key) {
    var val = void 0;
    if (_.isNil(obj)) {
      val = undefined;
    } else {
      if (typeof obj.to_liquid === 'function') {
        obj = obj.to_liquid();
      } else if (typeof obj.toLiquid === 'function') {
        obj = obj.toLiquid();
      }

      if (key === 'size' && (_.isArray(obj) || _.isString(obj))) {
        val = obj.length;
      } else {
        val = obj[key];
      }
    }
    if (_.isNil(val) && this.opts.strict_variables) {
      throw new TypeError('undefined variable: ' + key);
    }
    return val;
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
    str = String(str);
    var seq = [];
    var name = '';
    var j = void 0;
    var i = 0;
    while (i < str.length) {
      switch (str[i]) {
        case '[':
          push();

          var delemiter = str[i + 1];
          if (/['"]/.test(delemiter)) {
            // foo["bar"]
            j = str.indexOf(delemiter, i + 2);
            assert(j !== -1, 'unbalanced ' + delemiter + ': ' + str);
            name = str.slice(i + 2, j);
            push();
            i = j + 2;
          } else {
            // foo[bar.coo]
            j = matchRightBracket(str, i + 1);
            assert(j !== -1, 'unbalanced []: ' + str);
            name = str.slice(i + 1, j);
            if (!lexical.isInteger(name)) {
              // foo[bar] vs. foo[1]
              name = this.get(name);
            }
            push();
            i = j + 1;
          }
          break;
        case '.':
          // foo.bar, foo[0].bar
          push();
          i++;
          break;
        default:
          // foo.bar
          name += str[i];
          i++;
      }
    }
    push();

    if (!seq.length) {
      throw new TypeError('invalid path:"' + str + '"');
    }
    return seq;

    function push() {
      if (name.length) seq.push(name);
      name = '';
    }
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
  var defaultOptions = {
    dynamicPartials: true,
    strict_variables: false,
    strict_filters: false,
    blocks: {},
    root: []
  };
  var scope = Object.create(Scope);
  scope.opts = _.assign(defaultOptions, opts);
  scope.contexts = [ctx || {}];
  return scope;
};

exports.types = {
  AssignScope: Object.create(null),
  CaptureScope: Object.create(null),
  IncrementScope: Object.create(null),
  DecrementScope: Object.create(null)
};

},{"./lexical.js":7,"./util/assert.js":15,"./util/underscore.js":20}],12:[function(require,module,exports){
'use strict';

var operators = require('./operators.js')(isTruthy);
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
  throw new TypeError('cannot eval \'' + str + '\' as value');
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

},{"../src/util/assert.js":15,"./lexical.js":7,"./operators.js":8}],13:[function(require,module,exports){
'use strict';

var lexical = require('./lexical.js');
var Syntax = require('./syntax.js');
var assert = require('./util/assert.js');

function hash(markup, scope) {
  var obj = {};
  var match = void 0;
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
        return impl.render(scope, obj);
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

},{"./lexical.js":7,"./syntax.js":12,"./util/assert.js":15}],14:[function(require,module,exports){
'use strict';

var lexical = require('./lexical.js');
var TokenizationError = require('./util/error.js').TokenizationError;
var _ = require('./util/underscore.js');
var whiteSpaceCtrl = require('./whitespace-ctrl.js');
var assert = require('./util/assert.js');

function parse(input, file, options) {
  assert(_.isString(input), 'illegal input');

  var rLiquid = /({%-?([\s\S]*?)-?%})|({{-?([\s\S]*?)-?}})/g;
  var currIndent = 0;
  var lineNumber = LineNumber(input);
  var lastMatchEnd = 0;
  var tokens = [];

  for (var match; match = rLiquid.exec(input); lastMatchEnd = rLiquid.lastIndex) {
    if (match.index > lastMatchEnd) {
      tokens.push(parseHTMLToken(lastMatchEnd, match.index));
    }
    tokens.push(match[1] ? parseTagToken(match[1], match[2].trim(), match.index) : parseValueToken(match[3], match[4].trim(), match.index));
  }
  if (input.length > lastMatchEnd) {
    tokens.push(parseHTMLToken(lastMatchEnd, input.length));
  }
  whiteSpaceCtrl(tokens, options);
  return tokens;

  function parseTagToken(raw, value, pos) {
    var match = value.match(lexical.tagLine);
    var token = {
      type: 'tag',
      indent: currIndent,
      line: lineNumber.get(pos),
      trim_left: raw.slice(0, 3) === '{%-',
      trim_right: raw.slice(-3) === '-%}',
      raw: raw,
      value: value,
      input: input,
      file: file
    };
    if (!match) {
      throw new TokenizationError('illegal tag syntax', token);
    }
    token.name = match[1];
    token.args = match[2];
    return token;
  }

  function parseValueToken(raw, value, pos) {
    return {
      type: 'value',
      line: lineNumber.get(pos),
      trim_left: raw.slice(0, 3) === '{{-',
      trim_right: raw.slice(-3) === '-}}',
      raw: raw,
      value: value,
      input: input,
      file: file
    };
  }

  function parseHTMLToken(begin, end) {
    var htmlFragment = input.slice(begin, end);
    currIndent = _.last(htmlFragment.split('\n')).length;

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
    get: function get(pos) {
      var lines = html.slice(lastMatchBegin + 1, pos).split('\n');
      parsedLinesCount += lines.length - 1;
      lastMatchBegin = pos;
      return parsedLinesCount + 1;
    }
  };
}

exports.parse = parse;
exports.whiteSpaceCtrl = whiteSpaceCtrl;

},{"./lexical.js":7,"./util/assert.js":15,"./util/error.js":16,"./util/underscore.js":20,"./whitespace-ctrl.js":22}],15:[function(require,module,exports){
'use strict';

var AssertionError = require('./error.js').AssertionError;

function assert(predicate, message) {
  if (!predicate) {
    message = message || 'expect ' + predicate + ' to be true';
    throw new AssertionError(message);
  }
}

module.exports = assert;

},{"./error.js":16}],16:[function(require,module,exports){
'use strict';

var _ = require('./underscore.js');

function initError() {
  this.name = this.constructor.name;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
}

function initLiquidError(err, token) {
  initError.call(this);

  this.input = token.input;
  this.line = token.line;
  this.file = token.file;

  var context = mkContext(token.input, token.line);
  this.message = mkMessage(err.message, token);
  this.stack = context + '\n' + (this.stack || this.message) + (err.stack ? '\nFrom ' + err.stack : '');
}

function TokenizationError(message, token) {
  initLiquidError.call(this, { message: message }, token);
}
TokenizationError.prototype = Object.create(Error.prototype);
TokenizationError.prototype.constructor = TokenizationError;

function ParseError(e, token) {
  _.assign(this, e);
  this.originalError = e;

  initLiquidError.call(this, e, token);
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

  initLiquidError.call(this, e, tpl.token);
}
RenderError.prototype = Object.create(Error.prototype);
RenderError.prototype.constructor = RenderError;

function RenderBreakError(message) {
  initError.call(this);
  this.message = message + '';
}
RenderBreakError.prototype = Object.create(Error.prototype);
RenderBreakError.prototype.constructor = RenderBreakError;

function AssertionError(message) {
  initError.call(this);
  this.message = message + '';
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

},{"./underscore.js":20}],17:[function(require,module,exports){
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

},{"fs":3}],18:[function(require,module,exports){
'use strict';

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

},{}],19:[function(require,module,exports){
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

  // prototype extensions
};var _date = {
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

},{}],20:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var toStr = Object.prototype.toString;

/*
 * Checks if value is classified as a String primitive or object.
 * @param {any} value The value to check.
 * @return {Boolean} Returns true if value is a string, else false.
 */
function isString(value) {
  return toStr.call(value) === '[object String]';
}

function stringify(value) {
  if (isNil(value)) {
    return String(value);
  }
  if (typeof value.to_liquid === 'function') {
    return stringify(value.to_liquid());
  }
  if (typeof value.toLiquid === 'function') {
    return stringify(value.toLiquid());
  }
  if (isString(value)) {
    return value;
  }

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

function isNil(value) {
  return value === null || value === undefined;
}

function isArray(value) {
  // be compatible with IE 8
  return toStr.call(value) === '[object Array]';
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
    return Object.assign(object, src);
  });
  return object;
}

function last(arr) {
  return arr[arr.length - 1];
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

// lang
exports.isString = isString;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isNil = isNil;
exports.isError = isError;

// array
exports.range = range;
exports.last = last;

// object
exports.forOwn = forOwn;
exports.assign = assign;
exports.uniq = uniq;
exports.stringify = stringify;

},{}],21:[function(require,module,exports){
'use strict';

var resolve = require('resolve-url');
var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^/]+?|)(\.[^./]*|))(?:[/]*)$/;
var urlRe = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;
var _ = require('./underscore');

// https://github.com/jinder/path/blob/master/path.js#L567
exports.extname = function (path) {
  return splitPathRe.exec(path).slice(1)[3];
};

// https://www.npmjs.com/package/is-url
exports.valid = function (path) {
  return urlRe.test(path);
};

exports.resolve = function (root, path) {
  if (Object.prototype.toString.call(root) === '[object Array]') {
    root = root[0];
  }
  if (root && _.last(root) !== '/') {
    root += '/';
  }
  return resolve(root, path);
};

},{"./underscore":20,"resolve-url":5}],22:[function(require,module,exports){
'use strict';

var _ = require('./util/underscore.js');

function whiteSpaceCtrl(tokens, options) {
  options = _.assign({ greedy: true }, options);
  var inRaw = false;

  tokens.forEach(function (token, i) {
    if (shouldTrimLeft(token, inRaw, options)) {
      trimLeft(tokens[i - 1], options.greedy);
    }

    if (token.type === 'tag' && token.name === 'raw') inRaw = true;
    if (token.type === 'tag' && token.name === 'endraw') inRaw = false;

    if (shouldTrimRight(token, inRaw, options)) {
      trimRight(tokens[i + 1], options.greedy);
    }
  });
}

function shouldTrimLeft(token, inRaw, options) {
  if (inRaw) return false;
  if (token.type === 'tag') return token.trim_left || options.trim_tag_left;
  if (token.type === 'value') return token.trim_left || options.trim_value_left;
}

function shouldTrimRight(token, inRaw, options) {
  if (inRaw) return false;
  if (token.type === 'tag') return token.trim_right || options.trim_tag_right;
  if (token.type === 'value') return token.trim_right || options.trim_value_right;
}

function trimLeft(token, greedy) {
  if (!token || token.type !== 'html') return;

  var rLeft = greedy ? /\s+$/g : /[\t\r ]*$/g;
  token.value = token.value.replace(rLeft, '');
}

function trimRight(token, greedy) {
  if (!token || token.type !== 'html') return;

  var rRight = greedy ? /^\s+/g : /^[\t\r ]*\n?/g;
  token.value = token.value.replace(rRight, '');
}

module.exports = whiteSpaceCtrl;

},{"./util/underscore.js":20}],23:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;
var re = new RegExp('(' + lexical.identifier.source + ')\\s*=(.*)');
var assert = require('../src/util/assert.js');
var types = require('../src/scope').types;

module.exports = function (liquid) {
  liquid.registerTag('assign', {
    parse: function parse(token) {
      var match = token.args.match(re);
      assert(match, 'illegal token ' + token.raw);
      this.key = match[1];
      this.value = match[2];
    },
    render: function render(scope) {
      var ctx = Object.create(types.AssignScope);
      ctx[this.key] = liquid.evalValue(this.value, scope);
      scope.push(ctx);
      return Promise.resolve('');
    }
  });
};

},{"..":2,"../src/scope":11,"../src/util/assert.js":15}],24:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;
var re = new RegExp('(' + lexical.identifier.source + ')');
var assert = require('../src/util/assert.js');
var types = require('../src/scope.js').types;

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
        var ctx = Object.create(types.CaptureScope);
        ctx[_this2.variable] = html;
        scope.push(ctx);
      });
    }
  });
};

},{"..":2,"../src/scope.js":11,"../src/util/assert.js":15}],25:[function(require,module,exports){
'use strict';

var Liquid = require('..');

module.exports = function (liquid) {
  liquid.registerTag('case', {

    parse: function parse(tagToken, remainTokens) {
      var _this = this;

      this.cond = tagToken.args;
      this.cases = [];
      this.elseTemplates = [];

      var p = [];
      var stream = liquid.parser.parseStream(remainTokens).on('tag:when', function (token) {
        _this.cases.push({
          val: token.args,
          templates: p = []
        });
      }).on('tag:else', function () {
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

},{"..":2}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
'use strict';

var Liquid = require('..');
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

      var groups = scope.opts.groups = scope.opts.groups || {};
      var idx = groups[fingerprint];

      if (idx === undefined) {
        idx = groups[fingerprint] = 0;
      }

      var candidate = this.candidates[idx];
      idx = (idx + 1) % this.candidates.length;
      groups[fingerprint] = idx;

      return Promise.resolve(Liquid.evalValue(candidate, scope));
    }
  });
};

},{"..":2,"../src/util/assert.js":15}],28:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;
var assert = require('../src/util/assert.js');
var types = require('../src/scope').types;

module.exports = function (liquid) {
  liquid.registerTag('decrement', {
    parse: function parse(token) {
      var match = token.args.match(lexical.identifier);
      assert(match, 'illegal identifier ' + token.args);
      this.variable = match[0];
    },
    render: function render(scope, hash) {
      var context = scope.findContextFor(this.variable, function (ctx) {
        return Object.getPrototypeOf(ctx) !== types.CaptureScope && Object.getPrototypeOf(ctx) !== types.AssignScope;
      });
      if (!context) {
        context = Object.create(types.DecrementScope);
        scope.unshift(context);
      }
      if (typeof context[this.variable] !== 'number') {
        context[this.variable] = 0;
      }
      return --context[this.variable];
    }
  });
};

},{"..":2,"../src/scope":11,"../src/util/assert.js":15}],29:[function(require,module,exports){
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
          collection = Object.keys(collection).map(function (key) {
            return [key, collection[key]];
          });
        }
      }
      if (!Array.isArray(collection) || !collection.length) {
        return liquid.renderer.renderTemplates(this.elseTemplates, scope);
      }

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
          last: i === collection.length - 1,
          length: collection.length,
          rindex: collection.length - i,
          rindex0: collection.length - i - 1
        };
        return ctx;
      });

      var html = '';
      return mapSeries(contexts, function (context) {
        return Promise.resolve().then(function () {
          return scope.push(context);
        }).then(function () {
          return liquid.renderer.renderTemplates(_this2.templates, scope);
        }).then(function (partial) {
          return html += partial;
        }).catch(function (e) {
          if (e instanceof RenderBreakError) {
            html += e.resolvedHTML;
            if (e.message === 'continue') return;
          }
          throw e;
        }).then(function () {
          return scope.pop(context);
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

},{"..":2,"../src/util/assert.js":15,"../src/util/promise.js":18,"../src/util/underscore.js":20}],30:[function(require,module,exports){
'use strict';

var Liquid = require('..');

module.exports = function (liquid) {
  liquid.registerTag('if', {

    parse: function parse(tagToken, remainTokens) {
      var _this = this;

      this.branches = [];
      this.elseTemplates = [];

      var p;
      var stream = liquid.parser.parseStream(remainTokens).on('start', function () {
        return _this.branches.push({
          cond: tagToken.args,
          templates: p = []
        });
      }).on('tag:elsif', function (token) {
        _this.branches.push({
          cond: token.args,
          templates: p = []
        });
      }).on('tag:else', function () {
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

},{"..":2}],31:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;
var withRE = new RegExp('with\\s+(' + lexical.value.source + ')');
var staticFileRE = /[^\s,]+/;
var assert = require('../src/util/assert.js');

module.exports = function (liquid) {
  liquid.registerTag('include', {
    parse: function parse(token) {
      var match = staticFileRE.exec(token.args);
      if (match) {
        this.staticValue = match[0];
      }

      match = lexical.value.exec(token.args);
      if (match) {
        this.value = match[0];
      }

      match = withRE.exec(token.args);
      if (match) {
        this.with = match[1];
      }
    },
    render: function render(scope, hash) {
      var _this = this;

      var pFilepath = void 0;
      if (scope.opts.dynamicPartials) {
        if (lexical.quotedLine.exec(this.value)) {
          var template = this.value.slice(1, -1);
          pFilepath = liquid.parseAndRender(template, scope.getAll(), scope.opts);
        } else {
          pFilepath = Promise.resolve(Liquid.evalValue(this.value, scope));
        }
      } else {
        pFilepath = Promise.resolve(this.staticValue);
      }

      var originBlocks = scope.opts.blocks;
      var originBlockMode = scope.opts.blockMode;

      return pFilepath.then(function (filepath) {
        assert(filepath, 'cannot include with empty filename');
        scope.opts.blocks = {};
        scope.opts.blockMode = 'output';
        if (_this.with) {
          hash[filepath] = Liquid.evalValue(_this.with, scope);
        }
        return liquid.getTemplate(filepath, scope.opts.root);
      }).then(function (templates) {
        scope.push(hash);
        return liquid.renderer.renderTemplates(templates, scope);
      }).then(function (html) {
        scope.pop(hash);
        scope.opts.blocks = originBlocks;
        scope.opts.blockMode = originBlockMode;
        return html;
      });
    }
  });
};

},{"..":2,"../src/util/assert.js":15}],32:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var assert = require('../src/util/assert.js');
var lexical = Liquid.lexical;
var types = require('../src/scope').types;

module.exports = function (liquid) {
  liquid.registerTag('increment', {
    parse: function parse(token) {
      var match = token.args.match(lexical.identifier);
      assert(match, 'illegal identifier ' + token.args);
      this.variable = match[0];
    },
    render: function render(scope, hash) {
      var context = scope.findContextFor(this.variable, function (ctx) {
        return Object.getPrototypeOf(ctx) !== types.CaptureScope && Object.getPrototypeOf(ctx) !== types.AssignScope;
      });
      if (!context) {
        context = Object.create(types.IncrementScope);
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
};

},{"..":2,"../src/scope":11,"../src/util/assert.js":15}],33:[function(require,module,exports){
'use strict';

module.exports = function (engine) {
  require('./assign.js')(engine);
  require('./capture.js')(engine);
  require('./case.js')(engine);
  require('./comment.js')(engine);
  require('./cycle.js')(engine);
  require('./decrement.js')(engine);
  require('./for.js')(engine);
  require('./if.js')(engine);
  require('./include.js')(engine);
  require('./increment.js')(engine);
  require('./layout.js')(engine);
  require('./raw.js')(engine);
  require('./tablerow.js')(engine);
  require('./unless.js')(engine);
};

},{"./assign.js":23,"./capture.js":24,"./case.js":25,"./comment.js":26,"./cycle.js":27,"./decrement.js":28,"./for.js":29,"./if.js":30,"./include.js":31,"./increment.js":32,"./layout.js":34,"./raw.js":35,"./tablerow.js":36,"./unless.js":37}],34:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;
var assert = require('../src/util/assert.js');
var staticFileRE = /\S+/;

/*
 * blockMode:
 * * "store": store rendered html into blocks
 * * "output": output rendered html
 */

module.exports = function (liquid) {
  liquid.registerTag('layout', {
    parse: function parse(token, remainTokens) {
      var match = staticFileRE.exec(token.args);
      if (match) {
        this.staticLayout = match[0];
      }

      match = lexical.value.exec(token.args);
      if (match) {
        this.layout = match[0];
      }

      this.tpls = liquid.parser.parse(remainTokens);
    },
    render: function render(scope, hash) {
      var layout = scope.opts.dynamicPartials ? Liquid.evalValue(this.layout, scope) : this.staticLayout;
      assert(layout, 'cannot apply layout with empty filename');

      // render the remaining tokens immediately
      scope.opts.blockMode = 'store';
      return liquid.renderer.renderTemplates(this.tpls, scope).then(function (html) {
        if (scope.opts.blocks[''] === undefined) {
          scope.opts.blocks[''] = html;
        }
        return liquid.getTemplate(layout, scope.opts.root);
      }).then(function (templates) {
        scope.push(hash);
        scope.opts.blockMode = 'output';
        return liquid.renderer.renderTemplates(templates, scope);
      }).then(function (partial) {
        scope.pop(hash);
        return partial;
      });
    }
  });

  liquid.registerTag('block', {
    parse: function parse(token, remainTokens) {
      var _this = this;

      var match = /\w+/.exec(token.args);
      this.block = match ? match[0] : '';

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

      return Promise.resolve(scope.opts.blocks[this.block]).then(function (html) {
        return html === undefined
        // render default block
        ? liquid.renderer.renderTemplates(_this2.tpls, scope)
        // use child-defined block
        : html;
      }).then(function (html) {
        if (scope.opts.blockMode === 'store') {
          scope.opts.blocks[_this2.block] = html;
          return '';
        }
        return html;
      });
    }
  });
};

},{"..":2,"../src/util/assert.js":15}],35:[function(require,module,exports){
'use strict';

module.exports = function (liquid) {
  liquid.registerTag('raw', {
    parse: function parse(tagToken, remainTokens) {
      var _this = this;

      this.tokens = [];

      var stream = liquid.parser.parseStream(remainTokens);
      stream.on('token', function (token) {
        if (token.name === 'endraw') stream.stop();else _this.tokens.push(token);
      }).on('end', function () {
        throw new Error('tag ' + tagToken.raw + ' not closed');
      });
      stream.start();
    },
    render: function render(scope, hash) {
      return this.tokens.map(function (token) {
        return token.raw;
      }).join('');
    }
  });
};

},{}],36:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var mapSeries = require('../src/util/promise.js').mapSeries;
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

      var p;
      var stream = liquid.parser.parseStream(remainTokens).on('start', function () {
        return p = _this.templates;
      }).on('tag:endtablerow', function (token) {
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

      var collection = Liquid.evalExp(this.collection, scope) || [];

      var html = '';
      var offset = hash.offset || 0;
      var limit = hash.limit === undefined ? collection.length : hash.limit;

      var cols = hash.cols;
      var row;
      var col;

      // build array of arguments to pass to sequential promises...
      collection = collection.slice(offset, offset + limit);
      if (!cols) cols = collection.length;
      var contexts = collection.map(function (item, i) {
        var ctx = {};
        ctx[_this2.variable] = item;
        return ctx;
      });

      return mapSeries(contexts, function (context, idx) {
        row = Math.floor(idx / cols) + 1;
        col = idx % cols + 1;
        if (col === 1) {
          if (row !== 1) {
            html += '</tr>';
          }
          html += '<tr class="row' + row + '">';
        }

        html += '<td class="col' + col + '">';
        scope.push(context);
        return liquid.renderer.renderTemplates(_this2.templates, scope).then(function (partial) {
          scope.pop(context);
          html += partial;
          html += '</td>';
          return html;
        });
      }).then(function () {
        if (row > 0) {
          html += '</tr>';
        }
        return html;
      });
    }
  });
};

},{"..":2,"../src/util/assert.js":15,"../src/util/promise.js":18}],37:[function(require,module,exports){
'use strict';

var Liquid = require('..');

module.exports = function (liquid) {
  liquid.registerTag('unless', {
    parse: function parse(tagToken, remainTokens) {
      var _this = this;

      this.templates = [];
      this.elseTemplates = [];
      var p;
      var stream = liquid.parser.parseStream(remainTokens).on('start', function (x) {
        p = _this.templates;
        _this.cond = tagToken.args;
      }).on('tag:else', function () {
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
