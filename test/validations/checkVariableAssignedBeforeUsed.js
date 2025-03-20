const chai = require("chai");
const expect = chai.expect;
const { checkVariableAssignedBeforeUsed } = require("../../validations.js");
const Liquid = require("../../index.js");

describe("validation tests on liquid expressions", () => {
  describe("check whether variable used in liquidjs expressions has been defined before usage", () => {
    beforeEach(() => {
      engine = Liquid({});
    });

    it("should fail if variable used is not defined before", () => {
      const expression = `
      {% assign result = unknownVar | plus: 10 %}
    `;
      const expectedErrorArray = [
        'Variable "unknownVar" used before assignment in expression "result = unknownVar | plus: 10" on line 2',
      ];
      const actualErrorArray = checkVariableAssignedBeforeUsed(
        engine,
        expression
      );
      expect(actualErrorArray).to.deep.equal(expectedErrorArray);
    });

    it("should fail if variable used inside IF condition is not defined before", () => {
      const expression = `
      {% if y === "USD" %}
        {% assign result = x %}
      {% endif %}
    `;
      const expectedErrorArray = [
        'Variable "x" used before assignment in expression "result = x" on line 3',
      ];
      const actualErrorArray = checkVariableAssignedBeforeUsed(
        engine,
        expression
      );
      expect(actualErrorArray).to.deep.equal(expectedErrorArray);
    });

    it("should fail if variable used inside ELSE condition is not defined before", () => {
      const expression = `
      {% if x %}
        {% assign result = 10 %}
      {% else %}
        {% assign result = y | times: 2 %}
      {% endif %}
    `;
      const expectedErrorArray = [
        'Variable "y" used before assignment in expression "result = y | times: 2" on line 5',
      ];
      const actualErrorArray = checkVariableAssignedBeforeUsed(
        engine,
        expression
      );
      expect(actualErrorArray).to.deep.equal(expectedErrorArray);
    });

    it("should not fail if variable assigned using parseAssign is used inside nested IF condition is defined in previous IF layer", () => {
      const expression = `
      {% if x %}
        {% parseAssign safeVar = 10 %}
        {% if y %}
          {% assign result = safeVar | times: 2 %}
        {% endif %}
      {% endif %}
    `;
      const expectedErrorArray = [];
      const actualErrorArray = checkVariableAssignedBeforeUsed(
        engine,
        expression
      );
      expect(actualErrorArray).to.deep.equal(expectedErrorArray);
    });

    it("should fail if variable used inside nested IF condition is not defined in previous IF layer", () => {
      const expression = `
      {% if x %}
        {% if y %}
          {% assign result = safeVar | times: 2 %}
        {% endif %}
      {% endif %}
    `;
      const expectedErrorArray = [
        'Variable "safeVar" used before assignment in expression "result = safeVar | times: 2" on line 4',
      ];
      const actualErrorArray = checkVariableAssignedBeforeUsed(
        engine,
        expression
      );
      expect(actualErrorArray).to.deep.equal(expectedErrorArray);
    });

    it("should not fail if variable used inside nested IF condition is defined in previous IF layer", () => {
      const expression = `
      {% if x %}
      {% assign safeVar = 2 %}
        {% if y %}
          {% assign result = safeVar | times: 2 %}
        {% endif %}
      {% endif %}
    `;
      const expectedErrorArray = [];
      const actualErrorArray = checkVariableAssignedBeforeUsed(
        engine,
        expression
      );
      expect(actualErrorArray).to.deep.equal(expectedErrorArray);
    });
    it("should not fail if variable used inside nested FOR loop is defined in previous FOR layer", () => {
      const expression = `
      {% for x in items %}
       {% assign safeVar = 2 %}
        {% for y in items %}
          {% assign result = safeVar | times: 2 %}
        {% endfor %}
      {% endfor %}
    `;
      const expectedErrorArray = [];
      const actualErrorArray = checkVariableAssignedBeforeUsed(
        engine,
        expression
      );
      expect(actualErrorArray).to.deep.equal(expectedErrorArray);
    });

    it("should fail if variable used inside nested FOR loop is not defined in previous FOR layer", () => {
      const expression = `
      {% for x in items %}
        {% for y in items %}
          {% assign result = safeVar | times: 2 %}
        {% endfor %}
      {% endfor %}
    `;
      const expectedErrorArray = [
        'Variable "safeVar" used before assignment in expression "result = safeVar | times: 2" on line 4',
      ];
      const actualErrorArray = checkVariableAssignedBeforeUsed(
        engine,
        expression
      );
      expect(actualErrorArray).to.deep.equal(expectedErrorArray);
    });
  });
});
