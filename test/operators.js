const chai = require("chai");
const expect = chai.expect;

const { isTruthy } = require("../src/syntax.js");
const operators = require("../src/operators.js")(isTruthy);

describe("operators", () => {
  describe("operators/==", () => {
    const equals = operators["=="];
    it("should eval numbers", () => {
      expect(equals(1, 1)).to.be.true;
      expect(equals(0, 0)).to.be.true;
      expect(equals(-1, -1)).to.be.true;
      expect(equals(1, 0)).to.be.false;
    });

    it("should eval string", () => {
      expect(equals("", "")).to.be.true;
      expect(equals("abc", "abc")).to.be.true;
      expect(equals("abc", "xyz")).to.be.false;
    });

    it("should eval boolean", () => {
      expect(equals(true, true)).to.be.true;
      expect(equals(false, false)).to.be.true;
      expect(equals(true, false)).to.be.false;
    });
    it("should eval nullish values", () => {
      expect(equals(undefined, undefined)).to.be.true;
      expect(equals(null, null)).to.be.true;
      expect(equals(null, undefined)).to.be.false;
    });
  });

  describe("operators/!=", () => {
    const notEquals = operators["!="];
    it("should eval numbers", () => {
      expect(notEquals(1, 1)).to.be.false;
      expect(notEquals(0, 0)).to.be.false;
      expect(notEquals(-1, -1)).to.be.false;
      expect(notEquals(1, 0)).to.be.true;
    });

    it("should eval string", () => {
      expect(notEquals("", "")).to.be.false;
      expect(notEquals("abc", "abc")).to.be.false;
      expect(notEquals("abc", "xyz")).to.be.true;
    });

    it("should eval boolean", () => {
      expect(notEquals(true, true)).to.be.false;
      expect(notEquals(false, false)).to.be.false;
      expect(notEquals(true, false)).to.be.true;
    });

    it("should eval nullish values", () => {
      expect(notEquals(undefined, undefined)).to.be.false;
      expect(notEquals(null, null)).to.be.false;
      expect(notEquals(null, undefined)).to.be.true;
    });
  });

  describe("operators/>", () => {
    const greater = operators[">"];
    it("should eval numbers", () => {
      expect(greater(2, 1)).to.be.true;
      expect(greater(-1, -2)).to.be.true;
      expect(greater(-1, -1)).to.be.false;
      expect(greater(1, 2)).to.be.false;
    });

    it("should eval string", () => {
      expect(greater("", "")).to.be.false;
      expect(greater("abc", "abc")).to.be.false;
      expect(greater("abc", "xyz")).to.be.false;
      expect(greater("abc", "ab")).to.be.true;
      expect(greater("abc", "")).to.be.true;
    });

    it("should eval boolean", () => {
      expect(greater(true, true)).to.be.false;
      expect(greater(false, false)).to.be.false;
      expect(greater(true, false)).to.be.true;
    });

    it("should eval nullish values", () => {
      expect(greater(undefined, undefined)).to.be.false;
      expect(greater(null, null)).to.be.false;
      expect(greater(null, undefined)).to.be.false;
    });
  });

  describe("operators/>=", () => {
    const greaterEqual = operators[">="];
    it("should eval numbers", () => {
      expect(greaterEqual(2, 1)).to.be.true;
      expect(greaterEqual(-1, -2)).to.be.true;
      expect(greaterEqual(-1, -1)).to.be.true;
      expect(greaterEqual(1, 2)).to.be.false;
    });

    it("should eval string", () => {
      expect(greaterEqual("", "")).to.be.true;
      expect(greaterEqual("abc", "abc")).to.be.true;
      expect(greaterEqual("abc", "xyz")).to.be.false;
      expect(greaterEqual("abc", "ab")).to.be.true;
      expect(greaterEqual("abc", "")).to.be.true;
    });

    it("should eval boolean", () => {
      expect(greaterEqual(true, true)).to.be.true;
      expect(greaterEqual(false, false)).to.be.true;
      expect(greaterEqual(true, false)).to.be.true;
    });

    it("should eval nullish values", () => {
      expect(greaterEqual(undefined, undefined)).to.be.false;
      expect(greaterEqual(null, null)).to.be.false;
      expect(greaterEqual(null, undefined)).to.be.false;
    });
  });

  describe("operators/<", () => {
    const smaller = operators["<"];
    it("should eval numbers", () => {
      expect(smaller(2, 1)).to.be.false;
      expect(smaller(-1, -2)).to.be.false;
      expect(smaller(-1, -1)).to.be.false;
      expect(smaller(1, 2)).to.be.true;
      expect(smaller(-2, -1)).to.be.true;
    });

    it("should eval string", () => {
      expect(smaller("", "")).to.be.false;
      expect(smaller("abc", "abc")).to.be.false;
      expect(smaller("abc", "xyz")).to.be.true;
      expect(smaller("abc", "ab")).to.be.false;
      expect(smaller("abc", "")).to.be.false;
    });

    it("should eval boolean", () => {
      expect(smaller(true, true)).to.be.false;
      expect(smaller(false, false)).to.be.false;
      expect(smaller(true, false)).to.be.false;
    });

    it("should eval nullish values", () => {
      expect(smaller(undefined, undefined)).to.be.false;
      expect(smaller(null, null)).to.be.false;
      expect(smaller(null, undefined)).to.be.false;
    });
  });

  describe("operators/<=", () => {
    const smallerEquals = operators["<="];
    it("should eval numbers", () => {
      expect(smallerEquals(2, 1)).to.be.false;
      expect(smallerEquals(-1, -2)).to.be.false;
      expect(smallerEquals(-1, -1)).to.be.true;
      expect(smallerEquals(1, 2)).to.be.true;
      expect(smallerEquals(-2, -1)).to.be.true;
    });

    it("should eval string", () => {
      expect(smallerEquals("", "")).to.be.true;
      expect(smallerEquals("abc", "abc")).to.be.true;
      expect(smallerEquals("abc", "xyz")).to.be.true;
      expect(smallerEquals("abc", "ab")).to.be.false;
      expect(smallerEquals("abc", "")).to.be.false;
    });

    it("should eval boolean", () => {
      expect(smallerEquals(true, true)).to.be.true;
      expect(smallerEquals(false, false)).to.be.true;
      expect(smallerEquals(true, false)).to.be.false;
    });

    it("should eval nullish values", () => {
      expect(smallerEquals(undefined, undefined)).to.be.false;
      expect(smallerEquals(null, null)).to.be.false;
      expect(smallerEquals(null, undefined)).to.be.false;
    });
  });

  describe("operators/contains", () => {
    const contains = operators["contains"];
    it("should return false for numbers", () => {
      expect(contains(2, 1)).to.be.false;
      expect(contains(-1, -1)).to.be.false;
      expect(contains(1, 2)).to.be.false;
    });

    it("should eval string", () => {
      expect(contains("", "")).to.be.false;
      expect(contains("abc", "abc")).to.be.true;
      expect(contains("abc", "x")).to.be.false;
      expect(contains("abcd", "bc")).to.be.true;
    });

    it("should return false for boolean", () => {
      expect(contains(true, true)).to.be.false;
      expect(contains(false, false)).to.be.false;
      expect(contains(true, false)).to.be.false;
    });

    it("should return false for nullish values", () => {
      expect(contains(undefined, undefined)).to.be.false;
      expect(contains(null, null)).to.be.false;
      expect(contains(null, undefined)).to.be.false;
    });

    it("should eval string array values", () => {
      expect(contains(["a", "b", "c"], "b")).to.be.true;
      expect(contains(["a", "b", "c"], "x")).to.be.false;
    });

    it("should eval numeric array values", () => {
      expect(contains([1, 2, 3], 2)).to.be.true;
      expect(contains([1, 2, 3], 6)).to.be.false;
    });

    it("should return false for object array values", () => {
      expect(contains([{ x: 1 }, { x: 2 }, { x: 3 }], { x: 1 })).to.be.false;
    });
  });

  describe("operators/and", () => {
    it("should handle and operator", () => {
      const and = operators["and"];
      expect(and(true, true)).to.be.true;
      expect(and(false, true)).to.be.false;
      expect(and(false, false)).to.be.false;
      expect(and(null, undefined)).to.be.false;
      expect(and("", "")).to.be.true;
      expect(and("foo", "")).to.be.true;
      expect(and("foo", "bar")).to.be.true;
      expect(and(0, 0)).to.be.true;
      expect(and(0, 1)).to.be.true;
      expect(and(1, 1)).to.be.true;
      expect(and([1], {})).to.be.true;
      expect(and([], {})).to.be.true;
    });
  });

  describe("operators/or", () => {
    it("should handle or operator", () => {
      const or = operators["or"];
      expect(or(true, true)).to.be.true;
      expect(or(false, true)).to.be.true;
      expect(or(false, false)).to.be.false;
      expect(or(null, undefined)).to.be.false;
      expect(or("", "")).to.be.true;
      expect(or("foo", "")).to.be.true;
      expect(or("foo", "bar")).to.be.true;
      expect(or(0, 0)).to.be.true;
      expect(or(0, 1)).to.be.true;
      expect(or(1, 1)).to.be.true;
      expect(or([1], {})).to.be.true;
      expect(or([], {})).to.be.true;
    });
  });
});
