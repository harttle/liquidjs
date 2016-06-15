const _ = require('lodash');
const strftime = require('strftime').timezone(-(new Date()).getTimezoneOffset());

module.exports = function(liquid) {
    liquid.registerFilter('abs', v => Math.abs(v));
    liquid.registerFilter('append', (v, arg) => v + arg);
    liquid.registerFilter('capitalize', v => _.capitalize(v));
    liquid.registerFilter('ceil', v => Math.ceil(v));
    liquid.registerFilter('date', (v, arg) => strftime(arg, v));
    liquid.registerFilter('default', (v, arg) => arg || v);
    liquid.registerFilter('divided_by', (v, arg) => Math.floor(v/arg));
    liquid.registerFilter('downcase', v => v.toLowerCase());
    liquid.registerFilter('escape', v => _.escape(v));
    liquid.registerFilter('escape_once', v => _.escape(_.unescape(v)));
};
