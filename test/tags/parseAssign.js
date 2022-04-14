const Liquid = require("../..");
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-as-promised"));

describe("tags/parseAssign", function () {
  const liquid = Liquid();
  it("should throw when variable expression illegal", function () {
    const src = "{% parseAssign / %}";
    const ctx = {};
    return expect(liquid.parseAndRender(src, ctx)).to.be.rejectedWith(
      /illegal/
    );
  });

  it("should throw when variable value is illegal JSON", function () {
    const src = `{% parseAssign foo = '{prop: 123}' %}`;
    const ctx = {};
    return expect(liquid.parseAndRender(src, ctx)).to.be.rejected;
  });

  it("should parseAssign string", function () {
    const ctx = {};
    const src = `{% parseAssign foo='"bar"' -%}{{foo}}`;
    return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal("bar");
  });

  it("should parseAssign number", function () {
    const ctx = {};
    const src = "{% parseAssign foo=35 -%}{{foo}}";
    return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal("35");
  });
  it("should parseAssign boolean", function () {
    const ctx = {};
    const src = "{% parseAssign foo=false -%}{{foo}}";
    return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal("false");
  });

  it("should parseAssign array", function () {
    const ctx = {};
    const src =
      '{% parseAssign foo="[100,200,300]" -%}{{foo[0]}}__{{foo[1]}}__{{foo[2]}}';
    return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(
      "100__200__300"
    );
  });

  it("should parseAssign object", function () {
    const ctx = {};
    const src = `{% parseAssign foo='{"x": 100, "y": "bar"}' -%}{{foo.x}}__{{foo.y}}`;
    return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(
      "100__bar"
    );
  });
});
