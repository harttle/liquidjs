const _ = require('lodash');
const strftime = require('strftime').timezone(-(new Date()).getTimezoneOffset());

module.exports = function(liquid) {
    liquid.registerFilter('abs', v => Math.abs(v));
    liquid.registerFilter('append', (v, arg) => v + arg);
    liquid.registerFilter('capitalize', v => _.capitalize(v));
    liquid.registerFilter('ceil', v => Math.ceil(v));
    liquid.registerFilter('date', (v, arg) => strftime(arg, v));
    liquid.registerFilter('default', (v, arg) => arg || v);
    liquid.registerFilter('divided_by', (v, arg) => Math.floor(v / arg));
    liquid.registerFilter('downcase', v => v.toLowerCase());
    liquid.registerFilter('escape', v => _.escape(v));
    liquid.registerFilter('escape_once', v => _.escape(_.unescape(v)));
    liquid.registerFilter('first', v => v[0]);
    liquid.registerFilter('floor', v => Math.floor(v));
    liquid.registerFilter('join', _.join);
    liquid.registerFilter('last', v => v[v.length - 1]);
    liquid.registerFilter('lstrip', v => _.trimStart(v));
    liquid.registerFilter('map', (v, arg) => _.map(v, arg));
    liquid.registerFilter('minus', bindFixed((v, arg) => v - arg));
    liquid.registerFilter('modulo', bindFixed((v, arg) => v % arg));
    liquid.registerFilter('newline_to_br', v => v.replace(/\n/g, '<br />'));
    liquid.registerFilter('plus', bindFixed((v, arg) => v + arg));
    liquid.registerFilter('prepend', (v, arg) => arg + v);
    liquid.registerFilter('remove', (v, arg) => v.split(arg).join(''));
    liquid.registerFilter('remove_first', (v, l) => v.replace(l, ''));
    liquid.registerFilter('replace', (v, pattern, replacement) => 
        _.replace(v, new RegExp(_.escapeRegExp(pattern), 'g'), replacement));
    liquid.registerFilter('replace_first', _.replace);
    liquid.registerFilter('reverse', _.reverse);
    liquid.registerFilter('round', _.round);
    liquid.registerFilter('rstrip', _.trimEnd);
    liquid.registerFilter('size', _.size);
    liquid.registerFilter('slice', (v, begin, length) =>
        v.substr(begin, length === undefined ? 1 : length));
    liquid.registerFilter('sort', _.sortBy);
    liquid.registerFilter('split', _.split);
    liquid.registerFilter('strip', _.trim);
    liquid.registerFilter('strip_html', v => _.replace(v, /<\/?\s*\w+\s*\/?>/g, ''));
    liquid.registerFilter('strip_newlines', v => _.replace(v, /\n/g, ''));
    liquid.registerFilter('times', (v, arg) => v * arg);
    liquid.registerFilter('truncate', (v, l, o) => _.truncate(v, {
        length: l,
        omission: o === undefined ? '...' : o
    }));
    liquid.registerFilter('truncatewords', (v, l, o) => {
        if (o === undefined) o = '...';
        var arr = v.split(' ');
        var ret = arr.slice(0, l).join(' ');
        if (arr.length > l) ret += o;
        return ret;
    });
    liquid.registerFilter('uniq', _.uniq);
    liquid.registerFilter('upcase', _.toUpper);
    liquid.registerFilter('url_encode', encodeURIComponent);
};

function getFixed(v) {
    var p = (v + "").split(".");
    return (p.length > 1) ? p[1].length : 0;
}

function getMaxFixed(l, r) {
    return Math.max(getFixed(l), getFixed(r));
}

function bindFixed(cb) {
    return (l, r) => {
        var f = getMaxFixed(l, r);
        return cb(l, r).toFixed(f);
    };
}
