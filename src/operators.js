const equals = require("../sd-custom/custom-operator/equals");
const greaterThan = require("../sd-custom/custom-operator/greater");
const smallerThan = require("../sd-custom/custom-operator/smaller");
const greaterThanOrEquals = require("../sd-custom/custom-operator/greater-or-equal");
const smallerThanOrEquals = require("../sd-custom/custom-operator/smaller-or-equal");

module.exports = function (isTruthy) {
  return {
    "==": (l, r) => equals(l, r),
    "!=": (l, r) => !equals(l, r),
    ">": (l, r) => l !== null && r !== null && greaterThan(l, r),
    "<": (l, r) => l !== null && r !== null && smallerThan(l, r),
    ">=": (l, r) => l !== null && r !== null && greaterThanOrEquals(l, r),
    "<=": (l, r) => l !== null && r !== null && smallerThanOrEquals(l, r),
    contains: (l, r) => {
      if (!l) return false;
      if (typeof l.indexOf !== "function") return false;
      return l.indexOf(r) > -1;
    },
    and: (l, r) => isTruthy(l) && isTruthy(r),
    or: (l, r) => isTruthy(l) || isTruthy(r),
  };
};
