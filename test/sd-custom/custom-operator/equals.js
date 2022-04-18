const chai = require("chai");
const expect = chai.expect;

const equals = require("../../../sd-custom/custom-operator/equals.js");

describe("Custom equals operator", () => {
  it("should eval numbers correctly", () => {
    expect(equals(0, 0)).to.equal(true);
    expect(equals(-10, -10)).to.equal(true);
    expect(equals(10, 10)).to.equal(true);
    expect(equals(1, 2)).to.equal(false);
  });

  it("should eval string correctly", () => {
    expect(equals("", "")).to.equal(true);
    expect(equals("abc", "abc")).to.equal(true);
    expect(equals("123", "123")).to.equal(true);
    expect(equals("abc", "abd")).to.equal(false);
  });

  it("should eval boolean correctly", () => {
    expect(equals(true, true)).to.equal(true);
    expect(equals(false, false)).to.equal(true);
    expect(equals(true, false)).to.equal(false);
  });

  describe("should eval array correctly", () => {
    it("should return true for empty array", () => {
      expect(equals([], [])).to.equal(true);
    });
    it("should return true for identical arrays", () => {
      expect(equals([1, 2, 3], [1, 2, 3])).to.equal(true);
    });
    it("should return true for identical unsorted arrays", () => {
      expect(equals([1, 2, 3], [3, 2, 1])).to.equal(true);
    });
    it("should return true for identical unsorted string arrays", () => {
      expect(equals(["a", "b"], ["b", "a"])).to.equal(true);
    });
    it("should return false for non identical arrays", () => {
      expect(equals([1, 2, 3], [1, 2])).to.equal(false);
    });
    it("should return false for identical object arrays", () => {
      expect(equals([{ x: 1 }, { x: 2 }], [{ x: 1 }, { x: 2 }])).to.equal(
        false
      );
    });
  });

  describe("should eval duration correctly", () => {
    const dur1 = {
      value: 1,
      type: "YEARS",
      days: 365,
    };

    const dur2 = {
      value: 1,
      type: "YEARS",
      days: 365,
    };

    const dur3 = {
      value: 2,
      type: "MONTHS",
      days: 60,
    };

    it("should return true for identical duration", () => {
      expect(equals(dur1, dur2)).to.equal(true);
    });
    it("should return false for non identical duration", () => {
      expect(equals(dur1, dur3)).to.equal(false);
    });
  });

  describe("should eval date correctly", () => {
    const date1 = new Date(Date.UTC(2000, 0, 1)).toISOString();
    const date2 = "2000-01-01";
    const date3 = "2001-01-01";
    const date4 = "01-01-2001";

    it("should return true for identical dates", () => {
      expect(equals(date1, date1)).to.equal(true);
    });
    it("should return true for identical dates of different formats", () => {
      expect(equals(date1, date2)).to.equal(true);
    });
    it("should return false for non identical dates", () => {
      expect(equals(date2, date3)).to.equal(false);
    });
    it("should return false for unsupported date format", () => {
      expect(equals(date3, date4)).to.equal(false);
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
      expect(equals(curr1, { ...curr1 })).to.equal(true);
    });
    it("should return false for non identical currency values", () => {
      expect(equals(curr1, curr2)).to.equal(false);
    });
    it("should return false for non identical currency type", () => {
      expect(equals(curr1, curr3)).to.equal(false);
    });
  });

  describe("should eval phone number correctly", () => {
    const ph1 = {
      number: "9876543210",
      code: "+1",
      country_code: "+1",
    };

    const ph2 = {
      number: "1111111",
      code: "+1",
      country_code: "+1",
    };

    const ph3 = {
      number: "9876543210",
      code: "+91",
      country_code: "+91",
    };

    it("should return true for identical phone number", () => {
      expect(equals(ph1, { ...ph1 })).to.equal(true);
    });
    it("should return false for non identical phone number values", () => {
      expect(equals(ph1, ph2)).to.equal(false);
    });
    it("should return false for non identical phone number code", () => {
      expect(equals(ph1, ph3)).to.equal(false);
    });
  });
});
