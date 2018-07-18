const strftime = require("./src/util/strftime.js");
const _ = require("./src/util/underscore.js");
const isTruthy = require("./src/syntax.js").isTruthy;

var escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&#34;",
  "'": "&#39;"
};
var unescapeMap = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&#34;": '"',
  "&#39;": "'"
};

var filters = {
  abs: v => Math.abs(v),
  append: (v, arg) => v + arg,
  capitalize: str =>
    stringify(str)
      .charAt(0)
      .toUpperCase() + str.slice(1),
  ceil: v => Math.ceil(v),
  concat: (v, arg) => Array.prototype.concat.call(v, arg),
  date: (v, arg) => {
    var date = v;
    if (v === "now") {
      date = new Date();
    } else if (_.isString(v)) {
      date = new Date(v);
    }
    return isValidDate(date) ? strftime(date, arg) : v;
  },
  default: (v, arg) => (isTruthy(v) ? v : arg),
  divided_by: (v, arg) => divide(v, arg),
  downcase: v => v.toLowerCase(),
  escape: escape,

  escape_once: str => escape(unescape(str)),
  first: v => v[0],
  floor: v => Math.floor(v),
  join: (v, arg) => v.join(arg),
  last: v => v[v.length - 1],
  lstrip: v => stringify(v).replace(/^\s+/, ""),
  map: (arr, arg) => arr.map(v => v[arg]),
  minus: (v, arg) => subtract(v, arg),
  modulo: bindFixed((v, arg) => v % arg),
  newline_to_br: v => v.replace(/\n/g, "<br />"),
  plus: (v, arg) => add(v, arg),
  prepend: (v, arg) => arg + v,
  remove: (v, arg) => v.split(arg).join(""),
  remove_first: (v, l) => v.replace(l, ""),
  replace: (v, pattern, replacement) =>
    stringify(v)
      .split(pattern)
      .join(replacement),
  replace_first: (v, arg1, arg2) => stringify(v).replace(arg1, arg2),
  reverse: v => v.reverse(),
  round: (v, arg) => {
    var amp = Math.pow(10, arg || 0);
    return Math.round(v * amp, arg) / amp;
  },
  rstrip: str => stringify(str).replace(/\s+$/, ""),
  size: v => v.length,
  slice: (v, begin, length) =>
    v.substr(begin, length === undefined ? 1 : length),
  sort: (v, arg) => v.sort(arg),
  split: (v, arg) => stringify(v).split(arg),
  strip: v => stringify(v).trim(),
  strip_html: v => stringify(v).replace(/<\/?\s*\w+\s*\/?>/g, ""),
  strip_newlines: v => stringify(v).replace(/\n/g, ""),
  times: (v, arg) => multiply(v, arg),
  truncate: (v, l, o) => {
    v = stringify(v);
    o = o === undefined ? "..." : o;
    l = l || 16;
    if (v.length <= l) return v;
    return v.substr(0, l - o.length) + o;
  },
  truncatewords: (v, l, o) => {
    if (o === undefined) o = "...";
    var arr = v.split(" ");
    var ret = arr.slice(0, l).join(" ");
    if (arr.length > l) ret += o;
    return ret;
  },
  uniq: function(arr) {
    var u = {};
    return (arr || []).filter(val => {
      if (u.hasOwnProperty(val)) {
        return false;
      }
      u[val] = true;
      return true;
    });
  },
  upcase: str => stringify(str).toUpperCase(),
  url_encode: encodeURIComponent
};

function escape(str) {
  return stringify(str).replace(/&|<|>|"|'/g, m => escapeMap[m]);
}

function unescape(str) {
  return stringify(str).replace(/&(amp|lt|gt|#34|#39);/g, m => unescapeMap[m]);
}

function getFixed(v) {
  var p = (v + "").split(".");
  return p.length > 1 ? p[1].length : 0;
}

function getMaxFixed(l, r) {
  return Math.max(getFixed(l), getFixed(r));
}

function stringify(obj) {
  return obj + "";
}

function bindFixed(cb) {
  return (l, r) => {
    var f = getMaxFixed(l, r);
    return cb(l, r).toFixed(f);
  };
}

function registerAll(liquid) {
  return _.forOwn(filters, (func, name) => liquid.registerFilter(name, func));
}

function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}

function multiply(v, arg) {
  return performOperations(v, arg, "MULTIPLY");
}

function filterNumericKeysFromObject(obj) {
  return Object.keys(obj).filter(key => !Number.isNaN(parseInt(obj[key])));
}

function getObjectValues(obj) {
  let resultObj = {};
  keys = Object.keys(obj);
  keys.forEach(key => {
    resultObj[key] = obj[key];
  });
  return resultObj;
}

function subtract(v, arg) {
  return performOperations(v, arg, "SUBTRACT");
}

function divide(v, arg) {
  return performOperations(v, arg, "DIVIDE");
}

function add(v, arg) {
  return performOperations(v, arg, "ADD");
}

function performOperations(v, arg, operation) {
  if (typeof v === "object" && typeof arg === "object") {
    result = Object.assign(getObjectValues(arg), getObjectValues(v));
    const numberKeysOfArg = filterNumericKeysFromObject(arg);
    const numberKeysOfV = filterNumericKeysFromObject(v);
    const commonNumericKeys = numberKeysOfV.filter(
      elem => numberKeysOfArg.indexOf(elem) !== -1
    );
    if (commonNumericKeys.length > 0) {
      numberKeysOfArg.forEach(key => {
        result[key] = operationOnItem(v[key], arg[key], operation);
      });
      return result;
    } else {
      console.warn("The objects don't have any common numeric attributes");
    }
  } else if (typeof v === "number" && typeof arg === "object") {
    result = getObjectValues(arg);
    const numberKeys = filterNumericKeysFromObject(arg);
    numberKeys.forEach(key => {
      result[key] = operationOnItem(v, arg[key], operation);
    });
    return result;
  } else if (typeof v === "object" && typeof arg === "number") {
    result = getObjectValues(v);
    const numberKeys = filterNumericKeysFromObject(v);
    numberKeys.forEach(key => {
      result[key] = operationOnItem(v[key], arg, operation);
    });
    return result;
  } else {
    return operationOnItem(v, arg, operation);
  }
}

function operationOnItem(v, arg, operation) {
  switch (operation) {
    case "ADD":
      return v + arg;
    case "SUBTRACT":
      return v - arg;
    case "DIVIDE":
      return parseFloat((v / arg).toFixed(3));
    case "MULTIPLY":
      return v * arg;
  }
}

registerAll.filters = filters;
module.exports = registerAll;
