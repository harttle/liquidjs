const Liquid = require("../..");
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-as-promised"));

describe("tags/computeColumn", function () {
  it("should compute column values", function () {
    const liquid = Liquid();

    const ctx = {
      dynamicTable: [
        { col1: 2, col2: 3, col3: undefined },
        { col1: 1, col2: 4, col3: undefined },
      ],
      someOtherVariable: 10,
    };
    const src = `{% computeColumn dynamicTable col3 %}
                      {% assign dummy = 1 %}
                      {% assign dummy2 = 2 %}
                      {% assign col3 = self.col1 | plus: self.col2 | plus: someOtherVariable %}
                      {% if dummy == 1 %}
                        {% assign dummy2 = 0 %}
                      {% endif %}
                      {% assign $$answer = col3 | plus: dummy2 | minus: someOtherVariable | append: ' Per month' %}
                {% endcomputeColumn %}`;
    liquid.parseAndRender(src, ctx).then(() => {
      expect(ctx).to.deep.equal({
        dynamicTable: [
          { col1: 2, col2: 3, col3: "5 Per month" },
          { col1: 1, col2: 4, col3: "5 Per month" },
        ],
        someOtherVariable: 10,
      });
    });
  });

  it("should not change variable outside", function () {
    const liquid = Liquid();

    const ctx = {
      dynamicTable: [
        { col1: 2, col2: 3, col3: undefined },
        { col1: 1, col2: 4, col3: undefined },
      ],
      someOtherVariable: 10,
    };
    const src = `{% computeColumn dynamicTable col3 %}
                      {% assign dummy = 1 -%}
                      {% assign col3 = self.col1 | plus: self.col2 | plus: someOtherVariable %}
                       {% assign someOtherVariable = 100%}
                      {% assign $$answer = col3 | plus: dummy2 | minus: someOtherVariable | append: ' Per month' %}
                {% endcomputeColumn %}`;
    liquid.parseAndRender(src, ctx).then(() => {
      expect(ctx.someOtherVariable).to.equal(10);
    });
  });

  it("should not throw error if $$answer is not present and evaluate it as undefined", async function () {
    const liquid = Liquid();

    const ctx = {
      dynamicTable: [
        { col1: 2, col2: 3, col3: undefined },
        { col1: 1, col2: 4, col3: undefined },
      ],
      someOtherVariable: 10,
    };
    const src = `{% computeColumn dynamicTable col3 %}
                      {% assign dummy = 1 -%}
                      {% assign col3 = self.col1 | plus: self.col2 | plus: someOtherVariable %}
                       {% assign someOtherVariable = 100%}
                {% endcomputeColumn %}`;
    await expect(liquid.parseAndRender(src, ctx)).to.be.fulfilled
    expect(ctx).to.deep.equal({
      dynamicTable: [
        { col1: 2, col2: 3, col3: undefined },
        { col1: 1, col2: 4, col3: undefined },
      ],
      someOtherVariable: 10,
    });
  });
});
