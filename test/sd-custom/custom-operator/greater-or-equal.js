const chai = require("chai");
const expect = chai.expect;

const greaterThanOrEqual = require("../../../sd-custom/custom-operator/greater-or-equal.js");

describe("Custom greater or equals operator", () => {
  it("should eval numbers correctly", () => {
    expect(greaterThanOrEqual(0, 0)).to.equal(true);
    expect(greaterThanOrEqual(-1, -2)).to.equal(true);
    expect(greaterThanOrEqual(100, 10)).to.equal(true);
    expect(greaterThanOrEqual(1, 2)).to.equal(false);
  });

  it("should eval string correctly", () => {
    expect(greaterThanOrEqual("", "")).to.equal(true);
    expect(greaterThanOrEqual("abc", "abc")).to.equal(true);
    expect(greaterThanOrEqual("abd", "abc")).to.equal(true);
    expect(greaterThanOrEqual("abc", "abd")).to.equal(false);
    expect(greaterThanOrEqual("abc", "ab")).to.equal(true);
    expect(greaterThanOrEqual("abc", "")).to.equal(true);
  });

  it("should eval boolean correctly", () => {
    expect(greaterThanOrEqual(true, true)).to.equal(true);
    expect(greaterThanOrEqual(false, false)).to.equal(true);
    expect(greaterThanOrEqual(true, false)).to.equal(true);
  });

  it("should eval duration correctly", () => {
    const dur1 = {
      value: 1,
      type: "YEARS",
      days: 365,
    };

    const dur2 = {
      value: 2,
      type: "YEARS",
      days: 2 * 365,
    };

    const dur3 = {
      value: 2,
      type: "MONTHS",
      days: 2 * 30,
    };

    expect(greaterThanOrEqual(dur1, { ...dur1 })).to.equal(true);
    expect(greaterThanOrEqual(dur1, dur2)).to.equal(false);
    expect(greaterThanOrEqual(dur1, dur3)).to.equal(true);
    expect(greaterThanOrEqual(dur2, dur3)).to.equal(true);
  });

  describe("should eval date correctly", () => {
    const date1 = new Date(Date.UTC(2000, 0, 1)).toISOString();
    const date2 = "2000-01-01";
    const date3 = "2001-01-01";
    const date4 = "01-01-2001";

    it("should return true for identical dates", () => {
      expect(greaterThanOrEqual(date1, date1)).to.equal(true);
    });
    it("should eval dates", () => {
      expect(greaterThanOrEqual(date3, date2)).to.equal(true);
      expect(greaterThanOrEqual(date2, date3)).to.equal(false);
    });
    it("should eval dates of different formats", () => {
      expect(greaterThanOrEqual(date1, date2)).to.equal(true);
      expect(greaterThanOrEqual(date3, date1)).to.equal(true);
      expect(greaterThanOrEqual(date1, date3)).to.equal(false);
    });

    it("should return false for unsupported date format", () => {
      expect(greaterThanOrEqual(date3, date4)).to.equal(false);
    });
  });

  describe("should eval currency correctly", () => {
    const curr1 = {
      value: 100,
      type: "USD",
    };

    const curr2 = {
      value: 200,
      type: "USD",
    };

    const curr3 = {
      value: 100,
      type: "INR",
    };

    it("should return true for identical currency", () => {
      expect(greaterThanOrEqual(curr1, { ...curr1 })).to.equal(true);
    });
    it("should eval currency values", () => {
      expect(greaterThanOrEqual(curr1, curr2)).to.equal(false);
      expect(greaterThanOrEqual(curr2, curr1)).to.equal(true);
    });
    it("should return false for non identical currency type", () => {
      expect(greaterThanOrEqual(curr2, curr3)).to.equal(false);
    });
  });
});
