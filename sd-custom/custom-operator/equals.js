const moment = require("moment");
const { getType, SD_CUSTOM_TYPES } = require("../type-assert");

function dateEquals(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return false;
  }

  if (lType !== SD_CUSTOM_TYPES.date) {
    return false;
  }

  return moment.utc(l).isSame(moment.utc(r));
}

function durationEquals(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return false;
  }

  if (lType !== SD_CUSTOM_TYPES.duration) {
    return false;
  }

  return l.days === r.days;
}

function currencyEquals(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return false;
  }

  if (lType !== SD_CUSTOM_TYPES.currency) {
    return false;
  }

  return l.value === r.value && l.type === r.type;
}

function phoneNumberEquals(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return false;
  }

  if (lType !== SD_CUSTOM_TYPES.phoneNumber) {
    return false;
  }

  return l.number === r.number && l.code === r.code;
}

/**
 * Sorts the array using default JS sorting method.
 * Loops through the sorted arrays and checks whether they have same items at same index.
 * Empty array is considered equal to another empty array
 */
function arrayEquals(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return false;
  }

  if (lType !== SD_CUSTOM_TYPES.array) {
    return false;
  }

  if (l.length !== r.length) {
    return false;
  }

  // Empty array should be equal to another empty array
  if (l.length === 0) {
    return true;
  }

  const sortedL = [...l].sort();
  const sortedR = [...r].sort();

  return sortedL.every((val, idx) => {
    return val === sortedR[idx];
  });
}

function equals(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return false;
  }

  switch (lType) {
    case SD_CUSTOM_TYPES.array:
      return arrayEquals(l, r);
    case SD_CUSTOM_TYPES.duration:
      return durationEquals(l, r);
    case SD_CUSTOM_TYPES.date:
      return dateEquals(l, r);
    case SD_CUSTOM_TYPES.currency:
      return currencyEquals(l, r);
    case SD_CUSTOM_TYPES.phoneNumber:
      return phoneNumberEquals(l, r);
    default:
      return l === r;
  }
}

module.exports = equals;
