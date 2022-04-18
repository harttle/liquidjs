const Liquid = require("../../..");
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-as-promised"));

function getLiquidText(conditionStr) {
  return `{% if ${conditionStr} -%}true{% else -%}false{% endif %}`;
}

function getCtx() {
  return {
    lStr: "left",
    rStr: "right",
    lNum: 10,
    rNum: 100,
    lBool: false,
    rBool: true,
    lDate: "2000-01-01",
    rDate: "2001-01-01",
    lDur: {
      value: 1,
      type: "YEARS",
      days: 365,
    },
    rDur: {
      value: 2,
      type: "YEARS",
      days: 2 * 365,
    },
    lCurr: {
      value: 100,
      type: "USD",
    },
    rCurr: {
      value: 200,
      type: "USD",
    },
    lPhone: {
      number: "9876543210",
      code: "+1",
      country_code: "+1",
    },
    rPhone: {
      number: "1111111112",
      code: "+1",
      country_code: "+1",
    },
  };
}

const TRUE = "true";
const FALSE = "false";

describe("custom operators", () => {
  let ctx;
  let liquid;
  beforeEach(() => {
    ctx = getCtx();
    liquid = Liquid();
  });

  describe("custom operators/==", () => {
    it("should eval identical strings", function () {
      const src = getLiquidText("lStr == lStr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical strings", function () {
      const src = getLiquidText("lStr == rStr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval identical numbers", function () {
      const src = getLiquidText("lNum == lNum");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical numbers", function () {
      const src = getLiquidText("lNum == rNum");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval identical booleans", function () {
      const src = getLiquidText("lBool == lBool");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical booleans", function () {
      const src = getLiquidText("lBool == rBool");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval identical dates", function () {
      const src = getLiquidText("lDate == lDate");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical dates", function () {
      const src = getLiquidText("lDate == rDate");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval identical duration", function () {
      const src = getLiquidText("lDur == lDur");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical duration", function () {
      const src = getLiquidText("lDur == rDur");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval identical currency", function () {
      const src = getLiquidText("lCurr == lCurr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical currency", function () {
      const src = getLiquidText("lCurr == rCurr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval identical phone number", function () {
      const src = getLiquidText("lPhone == lPhone");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical phone number", function () {
      const src = getLiquidText("lPhone == rPhone");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });
  });

  describe("custom operators/!=", () => {
    it("should eval identical strings", function () {
      const src = getLiquidText("lStr != lStr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical strings", function () {
      const src = getLiquidText("lStr != rStr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval identical numbers", function () {
      const src = getLiquidText("lNum != lNum");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical numbers", function () {
      const src = getLiquidText("lNum != rNum");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval identical booleans", function () {
      const src = getLiquidText("lBool != lBool");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical booleans", function () {
      const src = getLiquidText("lBool != rBool");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval identical dates", function () {
      const src = getLiquidText("lDate != lDate");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical dates", function () {
      const src = getLiquidText("lDate != rDate");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval identical duration", function () {
      const src = getLiquidText("lDur != lDur");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical duration", function () {
      const src = getLiquidText("lDur != rDur");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval identical currency", function () {
      const src = getLiquidText("lCurr != lCurr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical currency", function () {
      const src = getLiquidText("lCurr != rCurr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval identical phone number", function () {
      const src = getLiquidText("lPhone != lPhone");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical phone number", function () {
      const src = getLiquidText("lPhone != rPhone");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });
  });

  describe("custom operators/>", () => {
    it("should eval identical strings", function () {
      const src = getLiquidText("lStr > lStr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical strings - 1", function () {
      const src = getLiquidText("lStr > rStr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical strings - 2", function () {
      const src = getLiquidText("rStr > lStr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval identical numbers", function () {
      const src = getLiquidText("lNum > lNum");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical numbers - 1", function () {
      const src = getLiquidText("lNum > rNum");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical numbers - 2", function () {
      const src = getLiquidText("rNum > lNum");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval identical booleans", function () {
      const src = getLiquidText("lBool > lBool");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical booleans - 1", function () {
      const src = getLiquidText("lBool > rBool");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical booleans - 2", function () {
      const src = getLiquidText("rBool > lBool");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval identical dates", function () {
      const src = getLiquidText("lDate > lDate");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical dates - 1", function () {
      const src = getLiquidText("lDate > rDate");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical dates - 2", function () {
      const src = getLiquidText("rDate > lDate");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval identical duration", function () {
      const src = getLiquidText("lDur > lDur");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical duration - 1", function () {
      const src = getLiquidText("lDur > rDur");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical duration - 2", function () {
      const src = getLiquidText("rDur > lDur");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval identical currency", function () {
      const src = getLiquidText("lCurr > lCurr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical currency - 1", function () {
      const src = getLiquidText("lCurr > rCurr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical currency - 2", function () {
      const src = getLiquidText("rCurr > lCurr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });
  });

  describe("custom operators/>=", () => {
    it("should eval identical strings", function () {
      const src = getLiquidText("lStr >= lStr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical strings - 1", function () {
      const src = getLiquidText("lStr >= rStr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical strings - 2", function () {
      const src = getLiquidText("rStr >= lStr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval identical numbers", function () {
      const src = getLiquidText("lNum >= lNum");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical numbers - 1", function () {
      const src = getLiquidText("lNum >= rNum");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical numbers - 2", function () {
      const src = getLiquidText("rNum >= lNum");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval identical booleans", function () {
      const src = getLiquidText("lBool >= lBool");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical booleans - 1", function () {
      const src = getLiquidText("lBool >= rBool");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical booleans - 2", function () {
      const src = getLiquidText("rBool >= lBool");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval identical dates", function () {
      const src = getLiquidText("lDate >= lDate");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical dates - 1", function () {
      const src = getLiquidText("lDate >= rDate");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical dates - 2", function () {
      const src = getLiquidText("rDate >= lDate");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval identical duration", function () {
      const src = getLiquidText("lDur >= lDur");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical duration - 1", function () {
      const src = getLiquidText("lDur >= rDur");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical duration - 2", function () {
      const src = getLiquidText("rDur >= lDur");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval identical currency", function () {
      const src = getLiquidText("lCurr >= lCurr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical currency - 1", function () {
      const src = getLiquidText("lCurr >= rCurr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical currency - 2", function () {
      const src = getLiquidText("rCurr >= lCurr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });
  });

  describe("custom operators/<", () => {
    it("should eval identical strings", function () {
      const src = getLiquidText("lStr < lStr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical strings - 1", function () {
      const src = getLiquidText("lStr < rStr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical strings - 2", function () {
      const src = getLiquidText("rStr < lStr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval identical numbers", function () {
      const src = getLiquidText("lNum < lNum");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical numbers - 1", function () {
      const src = getLiquidText("lNum < rNum");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical numbers - 2", function () {
      const src = getLiquidText("rNum < lNum");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval identical booleans", function () {
      const src = getLiquidText("lBool < lBool");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical booleans - 1", function () {
      const src = getLiquidText("lBool < rBool");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical booleans - 2", function () {
      const src = getLiquidText("rBool < lBool");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval identical dates", function () {
      const src = getLiquidText("lDate < lDate");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical dates - 1", function () {
      const src = getLiquidText("lDate < rDate");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical dates - 2", function () {
      const src = getLiquidText("rDate < lDate");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval identical duration", function () {
      const src = getLiquidText("lDur < lDur");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical duration - 1", function () {
      const src = getLiquidText("lDur < rDur");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical duration - 2", function () {
      const src = getLiquidText("rDur < lDur");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval identical currency", function () {
      const src = getLiquidText("lCurr < lCurr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval non identical currency - 1", function () {
      const src = getLiquidText("lCurr < rCurr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical currency - 2", function () {
      const src = getLiquidText("rCurr < lCurr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });
  });

  describe("custom operators/<=", () => {
    it("should eval identical strings", function () {
      const src = getLiquidText("lStr <= lStr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical strings - 1", function () {
      const src = getLiquidText("lStr <= rStr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical strings - 2", function () {
      const src = getLiquidText("rStr <= lStr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval identical numbers", function () {
      const src = getLiquidText("lNum <= lNum");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical numbers - 1", function () {
      const src = getLiquidText("lNum <= rNum");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical numbers - 2", function () {
      const src = getLiquidText("rNum <= lNum");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval identical booleans", function () {
      const src = getLiquidText("lBool <= lBool");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical booleans - 1", function () {
      const src = getLiquidText("lBool <= rBool");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical booleans - 2", function () {
      const src = getLiquidText("rBool <= lBool");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval identical dates", function () {
      const src = getLiquidText("lDate <= lDate");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical dates - 1", function () {
      const src = getLiquidText("lDate <= rDate");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical dates - 2", function () {
      const src = getLiquidText("rDate <= lDate");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval identical duration", function () {
      const src = getLiquidText("lDur <= lDur");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical duration - 1", function () {
      const src = getLiquidText("lDur <= rDur");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical duration - 2", function () {
      const src = getLiquidText("rDur <= lDur");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });

    it("should eval identical currency", function () {
      const src = getLiquidText("lCurr <= lCurr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical currency - 1", function () {
      const src = getLiquidText("lCurr <= rCurr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(TRUE);
    });

    it("should eval non identical currency - 2", function () {
      const src = getLiquidText("rCurr <= lCurr");
      return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(FALSE);
    });
  });
});
