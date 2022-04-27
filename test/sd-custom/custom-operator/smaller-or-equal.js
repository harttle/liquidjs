const chai = require("chai");
const expect = chai.expect;

const smallerThanOrEqual = require("../../../sd-custom/custom-operator/smaller-or-equal.js");

describe("Custom smaller or equals operator", () => {
  it("should use default evaluation for operands of different types", () => {
    expect(smallerThanOrEqual(1, "1")).to.equal(1 <= "1");
    expect(smallerThanOrEqual(5, "1")).to.equal(5 <= "1");
    expect(smallerThanOrEqual("1", 5)).to.equal("1" <= 5);
    expect(smallerThanOrEqual("5", true)).to.equal("5" <= true);
    expect(smallerThanOrEqual(5, {})).to.equal(5 <= {});
  });

  it("should eval numbers correctly", () => {
    expect(smallerThanOrEqual(0, 0)).to.equal(true);
    expect(smallerThanOrEqual(-1, -2)).to.equal(false);
    expect(smallerThanOrEqual(100, 10)).to.equal(false);
    expect(smallerThanOrEqual(1, 2)).to.equal(true);
  });

  it("should eval string correctly", () => {
    expect(smallerThanOrEqual("", "")).to.equal(true);
    expect(smallerThanOrEqual("abc", "abc")).to.equal(true);
    expect(smallerThanOrEqual("abd", "abc")).to.equal(false);
    expect(smallerThanOrEqual("abc", "abd")).to.equal(true);
    expect(smallerThanOrEqual("ab", "abc")).to.equal(true);
    expect(smallerThanOrEqual("abc", "")).to.equal(false);
  });

  it("should eval boolean correctly", () => {
    expect(smallerThanOrEqual(true, true)).to.equal(true);
    expect(smallerThanOrEqual(false, false)).to.equal(true);
    expect(smallerThanOrEqual(true, false)).to.equal(false);
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

    expect(smallerThanOrEqual(dur1, { ...dur1 })).to.equal(true);
    expect(smallerThanOrEqual(dur1, dur2)).to.equal(true);
    expect(smallerThanOrEqual(dur1, dur3)).to.equal(false);
    expect(smallerThanOrEqual(dur2, dur3)).to.equal(false);
    expect(smallerThanOrEqual(dur3, dur1)).to.equal(true);
  });

  describe("should eval date correctly", () => {
    const date1 = new Date(Date.UTC(2000, 0, 1)).toISOString();
    const date2 = "2000-01-01";
    const date3 = "2001-01-01";
    const date4 = "01-01-2001";

    it("should return true for identical dates", () => {
      expect(smallerThanOrEqual(date1, date1)).to.equal(true);
    });
    it("should eval dates", () => {
      expect(smallerThanOrEqual(date3, date2)).to.equal(false);
      expect(smallerThanOrEqual(date2, date3)).to.equal(true);
    });
    it("should eval dates of different formats", () => {
      expect(smallerThanOrEqual(date1, date2)).to.equal(true);
      expect(smallerThanOrEqual(date3, date1)).to.equal(false);
      expect(smallerThanOrEqual(date1, date3)).to.equal(true);
    });

    it("should return false for unsupported date format", () => {
      expect(smallerThanOrEqual(date3, date4)).to.equal(date3 <= date4);
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
      expect(smallerThanOrEqual(curr1, { ...curr1 })).to.equal(true);
    });
    it("should eval currency values", () => {
      expect(smallerThanOrEqual(curr1, curr2)).to.equal(true);
      expect(smallerThanOrEqual(curr2, curr1)).to.equal(false);
    });
    it("should return false for non identical currency type", () => {
      expect(smallerThanOrEqual(curr2, curr3)).to.equal(false);
    });
  });
});
