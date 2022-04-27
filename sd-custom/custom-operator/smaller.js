const moment = require("moment");
const { getType, SD_CUSTOM_TYPES } = require("../type-assert");

function dateSmaller(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return false;
  }

  if (lType !== SD_CUSTOM_TYPES.date) {
    return false;
  }
  return moment.utc(l).isBefore(moment.utc(r));
}

function durationSmaller(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return false;
  }

  if (lType !== SD_CUSTOM_TYPES.duration) {
    return false;
  }

  return l.days < r.days;
}

function currencySmaller(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return false;
  }

  if (lType !== SD_CUSTOM_TYPES.currency) {
    return false;
  }

  return l.value < r.value && l.type === r.type;
}

function defaultHandler(l, r) {
  return l < r;
}

function smaller(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return defaultHandler(l, r);
  }

  switch (lType) {
    case SD_CUSTOM_TYPES.duration:
      return durationSmaller(l, r);
    case SD_CUSTOM_TYPES.currency:
      return currencySmaller(l, r);
    case SD_CUSTOM_TYPES.date:
      return dateSmaller(l, r);
    default:
      return defaultHandler(l, r);
  }
}

module.exports = smaller;
