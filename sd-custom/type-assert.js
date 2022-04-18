const moment = require("moment");

const CF_DATE_FORMAT = "YYYY-MM-DD";

const SD_CUSTOM_TYPES = {
  date: "date",
  string: "string",
  number: "number",
  boolean: "boolean",
  array: "array",
  duration: "duration",
  currency: "currency",
  phoneNumber: "phone-number",
};

function isValidDateString(dateString) {
  return (
    typeof dateString === "string" &&
    (moment(dateString, moment.ISO_8601, true).isValid() ||
      moment(dateString, CF_DATE_FORMAT, true).isValid())
  );
}

function isDurationObject(durationObj) {
  if (!durationObj || !durationObj.hasOwnProperty) {
    return false;
  }

  const durationProps = ["value", "type", "days"];
  if (durationProps.some((prop) => !durationObj.hasOwnProperty(prop))) {
    return false;
  }

  const units = ["DAYS", "WEEKS", "MONTHS", "YEARS"];
  if (units.indexOf(durationObj.type) != -1) {
    return true;
  }

  return false;
}

function isCurrencyObject(currencyObj) {
  if (!currencyObj || !currencyObj.hasOwnProperty) {
    return false;
  }

  const durationProps = ["value", "type"];
  if (durationProps.some((prop) => !currencyObj.hasOwnProperty(prop))) {
    return false;
  }

  return true;
}

function isValidPhoneNumber(phoneNumberObj) {
  if (!phoneNumberObj || !phoneNumberObj.hasOwnProperty) {
    return false;
  }

  const phoneNumberProps = ["number", "code"];
  if (phoneNumberProps.some((prop) => !phoneNumberObj.hasOwnProperty(prop))) {
    return false;
  }

  return true;
}

function getType(v) {
  // This check should be before string check as date strings are also valid strings
  if (isValidDateString(v)) {
    return SD_CUSTOM_TYPES.date;
  }

  if (typeof v === "string") {
    return SD_CUSTOM_TYPES.string;
  }

  if (typeof v === "number" && !Number.isNaN(v)) {
    return SD_CUSTOM_TYPES.number;
  }

  if (typeof v === "boolean") {
    return SD_CUSTOM_TYPES.boolean;
  }

  if (Array.isArray(v)) {
    return SD_CUSTOM_TYPES.array;
  }

  // It is important to have Duration check before currency check because properties of Duration
  // are a superset of Currency. So a duration object will match currency check.
  if (isDurationObject(v)) {
    return SD_CUSTOM_TYPES.duration;
  }

  if (isCurrencyObject(v)) {
    return SD_CUSTOM_TYPES.currency;
  }

  if (isValidPhoneNumber(v)) {
    return SD_CUSTOM_TYPES.phoneNumber;
  }
}

module.exports = { getType, SD_CUSTOM_TYPES };
