const Liquid = require("..");
const lexical = Liquid.lexical;
const Promise = require("any-promise");
const re = new RegExp(`(${lexical.identifier.source})\\s*=(.*)`);
const assert = require("../src/util/assert.js");

function parseFromString(objStr) {
  const jsonStr = `{"val": ${objStr}}`;
  return JSON.parse(jsonStr).val;
}

/**
 * This tag can be used to assign object and arrays to variables directly
 * in liquid code. This modifies the scope to add the parsed object or array
 * against the provided key.
 *
 * Usage:
 * {% parseAssign arr = "[1,2,3]" %}
 * {% parseAssign obj = '{"prop1": prop1Val, "prop2": prop2Val}' %}
 *
 * Result:
 * Scope now has
 * {
 *  ...,
 *  arr: [1,2,3],
 *  obj: {
 *    prop1: prop1Val,
 *    prop2: prop2Val
 *  }
 * }
 *
 * Note: The value being assigned should be valid JSON.
 * Invalid JSON will results in exception being thrown.
 */
module.exports = function (liquid) {
  liquid.registerTag("parseAssign", {
    parse: function (token) {
      var match = token.args.match(re);
      assert(match, `illegal token ${token.raw}`);
      this.key = match[1];
      this.value = match[2];
    },
    render: function (scope) {
      const value = liquid.evalValue(this.value, scope);
      const actualValue = parseFromString(value);
      scope.set(this.key, actualValue);
      return Promise.resolve("");
    },
  });
};
