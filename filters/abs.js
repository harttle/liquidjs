module.exports = function(liquid) {
    liquid.registerFilter('abs', v => Math.abs(v));
};
