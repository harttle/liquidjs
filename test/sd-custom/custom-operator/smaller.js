const chai = require("chai");
const expect = chai.expect;

const smaller = require("../../../sd-custom/custom-operator/smaller.js");

describe("Custom smaller than operator", () => {
  it("should eval numbers correctly", () => {
    expect(smaller(0, 0)).to.equal(false);
    expect(smaller(-1, -2)).to.equal(false);
    expect(smaller(100, 10)).to.equal(false);
    expect(smaller(1, 2)).to.equal(true);
  });

  it("should eval string correctly", () => {
    expect(smaller("", "")).to.equal(false);
    expect(smaller("abc", "abc")).to.equal(false);
    expect(smaller("abd", "abc")).to.equal(false);
    expect(smaller("abc", "abd")).to.equal(true);
    expect(smaller("ab", "abc")).to.equal(true);
    expect(smaller("abc", "")).to.equal(false);
  });

  it("should eval boolean correctly", () => {
    expect(smaller(true, true)).to.equal(false);
    expect(smaller(false, false)).to.equal(false);
    expect(smaller(true, false)).to.equal(false);
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

    expect(smaller(dur1, { ...dur1 })).to.equal(false);
    expect(smaller(dur1, dur2)).to.equal(true);
    expect(smaller(dur1, dur3)).to.equal(false);
    expect(smaller(dur2, dur3)).to.equal(false);
    expect(smaller(dur3, dur1)).to.equal(true);
  });

  describe("should eval date correctly", () => {
    const date1 = new Date(Date.UTC(2000, 0, 1)).toISOString();
    const date2 = "2000-01-01";
    const date3 = "2001-01-01";
    const date4 = "01-01-2001";

    it("should return false for identical dates", () => {
      expect(smaller(date1, date1)).to.equal(false);
    });
    it("should eval dates", () => {
      expect(smaller(date3, date2)).to.equal(false);
      expect(smaller(date2, date3)).to.equal(true);
    });
    it("should eval dates of different formats", () => {
      expect(smaller(date1, date2)).to.equal(false);
      expect(smaller(date3, date1)).to.equal(false);
      expect(smaller(date1, date3)).to.equal(true);
    });

    it("should return false for unsupported date format", () => {
      expect(smaller(date3, date4)).to.equal(false);
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
      expect(smaller(curr1, { ...curr1 })).to.equal(false);
    });
    it("should eval currency values", () => {
      expect(smaller(curr1, curr2)).to.equal(true);
      expect(smaller(curr2, curr1)).to.equal(false);
    });
    it("should return false for non identical currency type", () => {
      expect(smaller(curr2, curr3)).to.equal(false);
    });
  });
});
