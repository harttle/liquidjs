const chai = require("chai");
const expect = chai.expect;
const { checkValidJSON } = require("../../validations.js");
const Liquid = require("../../index.js");

describe("validation tests on liquid expressions", () => {
  describe("checkValidJSON function", () => {
    beforeEach(() => {
      engine = Liquid({});
    });

    it("should return an empty array if parseAssign is assigned a valid JSON value", () => {
      const expression = `
      {% unless a == "EUR" %}
        {% parseAssign x4 = "test" %}
      {% endunless %}
      {% parseAssign x1 = '{"key": "value"}' %}
        {% parseAssign x0 = "100" %}
        {% if a == "USD" %}
          {% parseAssign x1 = "test" %}
        {% elsif a == "INR" %}
          {% parseAssign x2 = "[1, 2, 3]" %}
        {% else %}
          {% parseAssign x3 = "true" %}
        {% endif %}
      `;
      const validationErrors = checkValidJSON(engine, expression);
      expect(validationErrors).to.deep.equal([]);
    });

    it("should return array of errors if parseAssign is assigned invalid JSON value", () => {
      const expression = `
        {% parseAssign x0 = 10, 0 %}
        {% parseAssign y = a | plus: b %}
        {% if a == "USD" and b == "INR" % }
          {% parseAssign x1 = {"key": value } %}  <!-- Invalid JSON -->
        {% elsif a == "INR" %}
          {% parseAssign x2 = [1, 2,] %}      <!-- Invalid JSON -->
        {% else %}
          {% parseAssign x3 = unquotedString %} <!-- Invalid JSON -->
        {% endif %}
      `;
      const expectedValidationErrors = [
        {
          expression: "parseAssign x0 =  10, 0",
          errorMessage:
            "Invalid value assigned to parseAssign statement at line 2",
        },
        {
          expression: "parseAssign y =  a | plus: b",
          errorMessage:
            "Invalid value assigned to parseAssign statement at line 3",
        },
        {
          expression: "parseAssign x2 =  [1, 2,]",
          errorMessage:
            "Invalid value assigned to parseAssign statement at line 7",
        },
        {
          expression: "parseAssign x3 =  unquotedString",
          errorMessage:
            "Invalid value assigned to parseAssign statement at line 9",
        },
      ];
      const validationErrors = checkValidJSON(engine, expression);
      expect(validationErrors).to.deep.equal(expectedValidationErrors);
    });
  });
});
