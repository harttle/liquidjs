const chai = require("chai");
const expect = chai.expect;
const Liquid = require("../../index.js");
const {
  checkAtleastOneDynamicTableAssignPresent,
} = require("../../validations.js");
describe("performs validations on liquidJS expressions", () => {
  before(() => {
    engine = Liquid({}); // Initialize once before all tests
  });

  describe("dynamic table validations : checks if there is atleast one occurence of $$answer = something which is not in any if, for or unless block", () => {
    it("should return an empty array if there is atleast one occurence of $$answer = something which is not in any if, for or unless block", () => {
      const expression = `
      {% computeColumn testTable test_column %}
      {% if x %}
      ...
      {% elsif y %}
      ...
      {% else %}
      ...
      {% endif %}
      {% for item in items %}
      ...
      {% endfor %}
      {% assign $$answer = test %}
      {% endcomputeColumn %}
    `;

      const expectedValidationErrors = [];
      const validationErrors = checkAtleastOneDynamicTableAssignPresent(
        engine,
        expression
      );
      expect(validationErrors).to.deep.equal(expectedValidationErrors);
    });

    it("should return an empty array if there is atleast one occurence of $$answer = something which is not in any if, for or unless block", () => {
      const expression = `
      {% computeColumn testTable test_column %}
      {% assign $$answer = test %}
      {% if x %}
      ...
      {% elsif y %}
      ...
      {% else %}
      ...
      {% endif %}
      {% for item in items %}
      ...
      {% endfor %}
      {% endcomputeColumn %}
    `;

      const expectedValidationErrors = [];
      const validationErrors = checkAtleastOneDynamicTableAssignPresent(
        engine,
        expression
      );
      expect(validationErrors).to.deep.equal(expectedValidationErrors);
    });

    it("should return an array of errors if there are no occurences of $$answer = something which is not in any if, for or unless block", () => {
      const expression = `
      {% computeColumn testTable test_column %}
      {% if x %}
        {% assign $$answer = test %}
      {% elsif y %}
        {% assign $$answer = test %}
      {% else %}
        {% assign $$answer = test %}
      {% endif %}
      {% for item in items %}
        {% assign $$answer = test %}
      {% endfor %}
      {% endcomputeColumn %}
    `;

      const expectedValidationErrors = [
        {
          message:
            "$$answer is not assigned outside any loops or condition block",
          metadata: {
            tableName: "testTable",
            columnName: "test_column",
          },
        },
      ];
      const validationErrors = checkAtleastOneDynamicTableAssignPresent(
        engine,
        expression
      );
      expect(validationErrors).to.deep.equal(expectedValidationErrors);
    });
  });
});
