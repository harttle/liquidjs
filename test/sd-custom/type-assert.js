const chai = require("chai");
const expect = chai.expect;

const { getType, SD_CUSTOM_TYPES } = require("../../sd-custom/type-assert.js");

describe("sd-custom type assertions", () => {
  it("should return undefined for undefined, null, NaN", () => {
    expect(getType(undefined)).to.be.undefined;
    expect(getType(null)).to.be.undefined;
    expect(getType(+"a")).to.be.undefined;
  });

  it("should handle string values", () => {
    expect(getType("hello")).to.equal(SD_CUSTOM_TYPES.string);
    expect(getType("")).to.equal(SD_CUSTOM_TYPES.string);
  });

  it("should handle number values", () => {
    expect(getType(100)).to.equal(SD_CUSTOM_TYPES.number);
    expect(getType(-100)).to.equal(SD_CUSTOM_TYPES.number);
  });

  it("should handle boolean values", () => {
    expect(getType(true)).to.equal(SD_CUSTOM_TYPES.boolean);
    expect(getType(false)).to.equal(SD_CUSTOM_TYPES.boolean);
  });

  it("should handle date string values", () => {
    expect(getType(new Date(2000, 0, 1).toISOString())).to.equal(
      SD_CUSTOM_TYPES.date
    );
    expect(getType("2020-01-01")).to.equal(SD_CUSTOM_TYPES.date);
    expect(getType("01-01-2020")).to.equal(SD_CUSTOM_TYPES.string);
  });

  it("should handle array values", () => {
    expect(getType([])).to.equal(SD_CUSTOM_TYPES.array);
    expect(getType([1, 2, 3])).to.equal(SD_CUSTOM_TYPES.array);
    expect(getType(["A", "b"])).to.equal(SD_CUSTOM_TYPES.array);
    expect(getType([{ x: 1 }, { x: 2 }])).to.equal(SD_CUSTOM_TYPES.array);
  });

  it("should handle duration values", () => {
    const validDuration = {
      value: 1,
      type: "YEARS",
      days: 365,
    };
    const invalidDuration1 = {
      value: 1,
      days: 365,
    };
    const invalidDuration2 = {
      value: 1,
      type: "CENTURY",
      days: 365,
    };
    expect(getType(validDuration)).to.equal(SD_CUSTOM_TYPES.duration);
    expect(getType(invalidDuration1)).to.be.undefined;
    // invalidDuration2 won't pass duration check but will pass currency check
    expect(getType(invalidDuration2)).to.equal(SD_CUSTOM_TYPES.currency);
  });

  it("should handle currency values", () => {
    const validCurrency = {
      value: 1,
      type: "YEARS",
    };
    const invalidCurrency = {
      value: 1,
    };
    expect(getType(validCurrency)).to.equal(SD_CUSTOM_TYPES.currency);
    expect(getType(invalidCurrency)).to.be.undefined;
  });

  it("should handle phone number values", () => {
    const validPhoneNumber = {
      number: "9876543210",
      code: "+1",
      country_code: "+1",
    };

    const invalidPhoneNumber = {
      number: "1111111",
      country_code: "+1",
    };

    const validPhoneNumber2 = {
      number: "9876543210",
      code: "+91",
    };

    expect(getType(validPhoneNumber)).to.equal(SD_CUSTOM_TYPES.phoneNumber);
    expect(getType(invalidPhoneNumber)).to.be.undefined;
    expect(getType(validPhoneNumber2)).to.equal(SD_CUSTOM_TYPES.phoneNumber);
  });
});
