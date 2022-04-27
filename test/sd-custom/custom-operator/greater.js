const chai = require("chai");
const expect = chai.expect;

const greater = require("../../../sd-custom/custom-operator/greater.js");

describe("Custom greater than operator", () => {
  it("should use default evaluation for operands of different types", () => {
    expect(greater(1, "1")).to.equal(1 > "1");
    expect(greater(5, "1")).to.equal(5 > "1");
    expect(greater("1", 5)).to.equal("1" > 5);
    expect(greater("5", true)).to.equal("5" > true);
    expect(greater(5, {})).to.equal(5 > {});
  });

  it("should eval numbers correctly", () => {
    expect(greater(0, 0)).to.equal(false);
    expect(greater(-1, -2)).to.equal(true);
    expect(greater(100, 10)).to.equal(true);
    expect(greater(1, 2)).to.equal(false);
  });

  it("should eval string correctly", () => {
    expect(greater("", "")).to.equal(false);
    expect(greater("abc", "abc")).to.equal(false);
    expect(greater("abd", "abc")).to.equal(true);
    expect(greater("abc", "abd")).to.equal(false);
    expect(greater("abc", "ab")).to.equal(true);
    expect(greater("abc", "")).to.equal(true);
  });

  it("should eval boolean correctly", () => {
    expect(greater(true, true)).to.equal(false);
    expect(greater(false, false)).to.equal(false);
    expect(greater(true, false)).to.equal(true);
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

    expect(greater(dur1, { ...dur1 })).to.equal(false);
    expect(greater(dur1, dur2)).to.equal(false);
    expect(greater(dur1, dur3)).to.equal(true);
    expect(greater(dur2, dur3)).to.equal(true);
  });

  describe("should eval date correctly", () => {
    const date1 = new Date(Date.UTC(2000, 0, 1)).toISOString();
    const date2 = "2000-01-01";
    const date3 = "2001-01-01";
    const date4 = "01-01-2001";

    it("should return false for identical dates", () => {
      expect(greater(date1, date1)).to.equal(false);
    });
    it("should eval dates", () => {
      expect(greater(date3, date2)).to.equal(true);
      expect(greater(date2, date3)).to.equal(false);
    });
    it("should eval dates of different formats", () => {
      expect(greater(date1, date2)).to.equal(false);
      expect(greater(date3, date1)).to.equal(true);
    });

    it("should return false for unsupported date format", () => {
      expect(greater(date3, date4)).to.equal(date3 > date4);
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

    it("should return false for identical currency", () => {
      expect(greater(curr1, { ...curr1 })).to.equal(false);
    });
    it("should eval currency values", () => {
      expect(greater(curr1, curr2)).to.equal(false);
      expect(greater(curr2, curr1)).to.equal(true);
    });
    it("should return false for non identical currency type", () => {
      expect(greater(curr2, curr3)).to.equal(false);
    });
  });
});
