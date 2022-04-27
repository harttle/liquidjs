const moment = require("moment");
const { getType, SD_CUSTOM_TYPES } = require("../type-assert");

function dateGreaterThan(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return false;
  }

  if (lType !== SD_CUSTOM_TYPES.date) {
    return false;
  }
  return moment.utc(l).isAfter(moment.utc(r));
}

function durationGreaterThan(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return false;
  }

  if (lType !== SD_CUSTOM_TYPES.duration) {
    return false;
  }

  return l.days > r.days;
}

function currencyGreaterThan(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return false;
  }

  if (lType !== SD_CUSTOM_TYPES.currency) {
    return false;
  }

  return l.value > r.value && l.type === r.type;
}

function defaultHandler(l, r) {
  return l > r;
}

function greaterThan(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return defaultHandler(l, r);
  }

  switch (lType) {
    case SD_CUSTOM_TYPES.duration:
      return durationGreaterThan(l, r);
    case SD_CUSTOM_TYPES.currency:
      return currencyGreaterThan(l, r);
    case SD_CUSTOM_TYPES.date:
      return dateGreaterThan(l, r);
    default:
      return defaultHandler(l, r);
  }
}

module.exports = greaterThan;
