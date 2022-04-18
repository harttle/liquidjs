const moment = require("moment");
const { getType, SD_CUSTOM_TYPES } = require("../type-assert");

function dateGreaterThanOrEqual(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return false;
  }

  if (lType !== SD_CUSTOM_TYPES.date) {
    return false;
  }
  return moment.utc(l).isSameOrAfter(moment.utc(r));
}

function durationGreaterThanOrEqual(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return false;
  }

  if (lType !== SD_CUSTOM_TYPES.duration) {
    return false;
  }

  return l.days >= r.days;
}

function currencyGreaterThanOrEqual(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return false;
  }

  if (lType !== SD_CUSTOM_TYPES.currency) {
    return false;
  }

  return l.value >= r.value && l.type === r.type;
}

function greaterThanOrEqual(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return false;
  }

  switch (lType) {
    case SD_CUSTOM_TYPES.duration:
      return durationGreaterThanOrEqual(l, r);
    case SD_CUSTOM_TYPES.currency:
      return currencyGreaterThanOrEqual(l, r);
    case SD_CUSTOM_TYPES.date:
      return dateGreaterThanOrEqual(l, r);
    default:
      return l >= r;
  }
}

module.exports = greaterThanOrEqual;
