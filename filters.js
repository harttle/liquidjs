const strftime = require('strftime').timezone(-(new Date()).getTimezoneOffset());

module.exports = function(liquid) {
    liquid.registerFilter('abs', v => Math.abs(v));
    liquid.registerFilter('append', (v, arg) => v + arg);
    liquid.registerFilter('capitalize', str =>
        (str || '').charAt(0).toUpperCase() + str.slice(1));
    liquid.registerFilter('ceil', v => Math.ceil(v));

    liquid.registerFilter('date', (v, arg) => strftime(arg, v));

    liquid.registerFilter('default', (v, arg) => arg || v);
    liquid.registerFilter('divided_by', (v, arg) => Math.floor(v / arg));
    liquid.registerFilter('downcase', v => v.toLowerCase());

    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&#34;',
        "'": '&#39;',
    };

    function escape(str) {
        return (str || '').replace(/&|<|>|"|'/g, m => escapeMap[m]);
    }
    liquid.registerFilter('escape', escape);

    var unescapeMap = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&#34;': '"',
        '&#39;': "'",
    };

    function unescape(str) {
        return (str || '').replace(/&(amp|lt|gt|#34|#39);/g, m => unescapeMap[m]);
    }
    liquid.registerFilter('escape_once', str => escape(unescape(str)));
    liquid.registerFilter('first', v => v[0]);
    liquid.registerFilter('floor', v => Math.floor(v));
    liquid.registerFilter('join', (v, arg) => v.join(arg));
    liquid.registerFilter('last', v => v[v.length - 1]);
    liquid.registerFilter('lstrip', v => (v || '').replace(/^\s+/, ''));
    liquid.registerFilter('map', (arr, arg) => arr.map(v => v[arg]));
    liquid.registerFilter('minus', bindFixed((v, arg) => v - arg));
    liquid.registerFilter('modulo', bindFixed((v, arg) => v % arg));
    liquid.registerFilter('newline_to_br', v => v.replace(/\n/g, '<br />'));
    liquid.registerFilter('plus', bindFixed((v, arg) => v + arg));
    liquid.registerFilter('prepend', (v, arg) => arg + v);
    liquid.registerFilter('remove', (v, arg) => v.split(arg).join(''));
    liquid.registerFilter('remove_first', (v, l) => v.replace(l, ''));
    liquid.registerFilter('replace', (v, pattern, replacement) =>
        (v || '').split(pattern).join(replacement));
    liquid.registerFilter('replace_first', (v, arg1, arg2) => (v || '').replace(arg1, arg2));
    liquid.registerFilter('reverse', v => (v || '').reverse());
    liquid.registerFilter('round', (v, arg) => {
        var amp = Math.pow(10, arg || 0);
        return Math.round(v * amp, arg) / amp;
    });
    liquid.registerFilter('rstrip', str => (str || '').replace(/\s+$/, ''));
    liquid.registerFilter('size', v => v.length);
    liquid.registerFilter('slice', (v, begin, length) =>
        v.substr(begin, length === undefined ? 1 : length));
    liquid.registerFilter('sort', (v, arg) => (v || '').sort(arg));
    liquid.registerFilter('split', (v, arg) => (v || '').split(arg));
    liquid.registerFilter('strip', (v) => (v || '').trim());
    liquid.registerFilter('strip_html', v => (v || '').replace(/<\/?\s*\w+\s*\/?>/g, ''));
    liquid.registerFilter('strip_newlines', v => (v || '').replace(/\n/g, ''));
    liquid.registerFilter('times', (v, arg) => v * arg);
    liquid.registerFilter('truncate', (v, l, o) => {
        v = v || '';
        o = (o === undefined) ? '...' : o;
        l = l || 16;
        if (v.length <= l) return v;
        return v.substr(0, l - o.length) + o;
    });
    liquid.registerFilter('truncatewords', (v, l, o) => {
        if (o === undefined) o = '...';
        var arr = v.split(' ');
        var ret = arr.slice(0, l).join(' ');
        if (arr.length > l) ret += o;
        return ret;
    });
    liquid.registerFilter('uniq', function(arr) {
        var u = {};
        return (arr || []).filter(val => {
            if (u.hasOwnProperty(val)) {
                return false;
            }
            u[val] = true;
            return true;
        });
    });
    liquid.registerFilter('upcase', str => (str || '').toUpperCase());
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
