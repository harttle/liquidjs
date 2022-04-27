const moment = require("moment");
const { getType, SD_CUSTOM_TYPES } = require("../type-assert");

function dateSmallerThanOrEqual(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return false;
  }

  if (lType !== SD_CUSTOM_TYPES.date) {
    return false;
  }
  return moment.utc(l).isSameOrBefore(moment.utc(r));
}

function durationSmallerThanOrEqual(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return false;
  }

  if (lType !== SD_CUSTOM_TYPES.duration) {
    return false;
  }

  return l.days <= r.days;
}

function currencySmallerThanOrEqual(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return false;
  }

  if (lType !== SD_CUSTOM_TYPES.currency) {
    return false;
  }

  return l.value <= r.value && l.type === r.type;
}

function defaultHandler(l, r) {
  return l <= r;
}

function smallerThanOrEqual(l, r) {
  const lType = getType(l);
  const rType = getType(r);

  if (lType !== rType) {
    return defaultHandler(l, r);
  }

  switch (lType) {
    case SD_CUSTOM_TYPES.duration:
      return durationSmallerThanOrEqual(l, r);
    case SD_CUSTOM_TYPES.currency:
      return currencySmallerThanOrEqual(l, r);
    case SD_CUSTOM_TYPES.date:
      return dateSmallerThanOrEqual(l, r);
    default:
      return defaultHandler(l, r);
  }
}

module.exports = smallerThanOrEqual;
