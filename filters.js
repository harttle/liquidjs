const strftime = require('./src/util/strftime.js');
const _ = require('./src/util/underscore.js');
const isTruthy = require('./src/syntax.js').isTruthy;

var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&#34;',
    "'": '&#39;',
};
var unescapeMap = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&#34;': '"',
    '&#39;': "'",
};

var filters = {
    'abs': v => Math.abs(v),
    'append': (v, arg) => v + arg,
    'capitalize': str => stringify(str).charAt(0).toUpperCase() + str.slice(1),
    'ceil': v => Math.ceil(v),
    'date': (v, arg) => {
        if (v === 'now') v = new Date();
        return v instanceof Date ? strftime(v, arg) : '';
    },
    'default': (v, arg) => isTruthy(v) ? v : arg,
    'divided_by': (v, arg) => Math.floor(v / arg),
    'downcase': v => v.toLowerCase(),
    'escape': escape,

    'escape_once': str => escape(unescape(str)),
    'first': v => v[0],
    'floor': v => Math.floor(v),
    'join': (v, arg) => v.join(arg),
    'last': v => v[v.length - 1],
    'lstrip': v => stringify(v).replace(/^\s+/, ''),
    'map': (arr, arg) => arr.map(v => v[arg]),
    'minus': bindFixed((v, arg) => v - arg),
    'modulo': bindFixed((v, arg) => v % arg),
    'newline_to_br': v => v.replace(/\n/g, '<br />'),
    'plus': bindFixed((v, arg) => Number(v) + Number(arg)),
    'prepend': (v, arg) => arg + v,
    'remove': (v, arg) => v.split(arg).join(''),
    'remove_first': (v, l) => v.replace(l, ''),
    'replace': (v, pattern, replacement) =>
        stringify(v).split(pattern).join(replacement),
    'replace_first': (v, arg1, arg2) => stringify(v).replace(arg1, arg2),
    'reverse': v => v.reverse(),
    'round': (v, arg) => {
        var amp = Math.pow(10, arg || 0);
        return Math.round(v * amp, arg) / amp;
    },
    'rstrip': str => stringify(str).replace(/\s+$/, ''),
    'size': v => v.length,
    'slice': (v, begin, length) =>
        v.substr(begin, length === undefined ? 1 : length),
    'sort': (v, arg) => v.sort(arg),
    'split': (v, arg) => stringify(v).split(arg),
    'strip': (v) => stringify(v).trim(),
    'strip_html': v => stringify(v).replace(/<\/?\s*\w+\s*\/?>/g, ''),
    'strip_newlines': v => stringify(v).replace(/\n/g, ''),
    'times': (v, arg) => v * arg,
    'truncate': (v, l, o) => {
        v = stringify(v);
        o = (o === undefined) ? '...' : o;
        l = l || 16;
        if (v.length <= l) return v;
        return v.substr(0, l - o.length) + o;
    },
    'truncatewords': (v, l, o) => {
        if (o === undefined) o = '...';
        var arr = v.split(' ');
        var ret = arr.slice(0, l).join(' ');
        if (arr.length > l) ret += o;
        return ret;
    },
    'uniq': function(arr) {
        var u = {};
        return (arr || []).filter(val => {
            if (u.hasOwnProperty(val)) {
                return false;
            }
            u[val] = true;
            return true;
        });
    },
    'upcase': str => stringify(str).toUpperCase(),
    'url_encode': encodeURIComponent
};

function escape(str) {
    return stringify(str).replace(/&|<|>|"|'/g, m => escapeMap[m]);
}

function unescape(str) {
    return stringify(str).replace(/&(amp|lt|gt|#34|#39);/g, m => unescapeMap[m]);
}

function getFixed(v) {
    var p = (v + "").split(".");
    return (p.length > 1) ? p[1].length : 0;
}

function getMaxFixed(l, r) {
    return Math.max(getFixed(l), getFixed(r));
}

function stringify(obj) {
    obj = obj || "";
    return obj + '';
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

registerAll.filters = filters;
module.exports = registerAll;
