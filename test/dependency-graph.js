const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;

chai.use(sinonChai);

var depGraph = require("../dependency-graph");

describe("dependency-graph: assign expression parsing", function () {
  let engine;

  beforeEach(() => {
    engine = depGraph.createEngine();
  });

  it("Should have one variable that depends on one and variable and a literal", () => {
    const expression = `{% assign m_f_p_s_p_t = m_f_p_s_p_o | divided_by: 100.00 %}`;
    const tmpls = depGraph.getTemplates(expression, engine);
    const variableData = depGraph.parseAssign(tmpls[0], engine);
    expect(variableData.defined).to.equal("m_f_p_s_p_t");
    expect(variableData.dependsOn.length).to.equal(1);
  });

  it("Should have one variable that depends on more than one variable", () => {
    const expression = `{% assign m_f_p_s_p_o = m_f_p_s | append: d_p_s_p %}`;
    const tmpls = depGraph.getTemplates(expression, engine);
    const graph = depGraph.parseAssign(tmpls[0], engine);
    expect(graph.defined).to.equal("m_f_p_s_p_o");
    expect(graph.dependsOn.length).to.equal(2);
    expect(graph.dependsOn[0]).to.equal("m_f_p_s");
    expect(graph.dependsOn[1]).to.equal("d_p_s_p");
  });

  it("Should have one variable that is a re-assignment", () => {
    const expression = `{% assign m_f_p_s_p_o = m_f_p_s %}`;
    const tmpls = depGraph.getTemplates(expression, engine);
    const graph = depGraph.parseAssign(tmpls[0], engine);
    expect(graph.defined).to.equal("m_f_p_s_p_o");
    expect(graph.dependsOn[0]).to.equal("m_f_p_s");
  });
});

describe("dependency-graph: parsing complete templates", function () {
  it("should have 2 variables in the graph", () => {
    const expression = `{% assign a = x | times: 3 %} {% assign b = a | divided_by: 3 %}`;
    const graph = depGraph.createDependencyTree(expression);
    expect(Object.keys(graph).length).to.equal(2);
  });

  it(`should handle single if...else conditions`, () => {
    const expression = `
    {% if p_s_p %}
      {% assign c = a | times: b %}
      {% assign d = c | divided_by: 100.00 %}
      {% assign e = a | minus: d %} 
      {% assign f = e | times: g %}
    {% else %}
      {% assign h = a | minus: i %}
      {% assign f = h | times: g %}
    {% endif %}
    `;
    const graph = depGraph.createDependencyTree(expression);
    expect(Object.keys(graph).length).to.equal(8);
    expect(graph["a"].length).to.equal(3);
    expect(graph["b"].length).to.equal(1);
    expect(graph["g"].length).to.equal(1);
  });

  it("Should handle complex templates", () => {
    const expression = `
    {% if private_seats %}
    {% if yes_discounts_private_seats %}
    {% if p_s_p %}
        {% assign m_f_p_s_p_o = m_f_p_s | times: d_p_s_p %}
        {% assign m_f_p_s_p_t = m_f_p_s_p_o | divided_by: 100.00 %}
        {% assign m_f_p_s_p = m_f_p_s | minus: m_f_p_s_p_t %} 
        {% assign t_m_f_p_s = m_f_p_s_p | times: c_p_s %}
    {% else %}
        {% assign m_f_p_s_a_o = m_f_p_s | minus: d_s_p_s_a %}
        {% assign t_m_f_p_s = m_f_p_s_a_o | times: c_p_s %}
    {% endif %}
    {% else %}
    {% assign t_m_f_p_s = m_f_p_s | times: c_p_s %}
    {% endif %}
{% else %}
{% assign t_m_f_p_s = t_m_f_p_s | updateAttribute: "value", 0 %}
{% endif %}
{% assign t_m_f = t_m_f_d_d | plus: t_m_f_h_d %}
{% assign t_m_f_c = t_m_f | plus: t_m_f_p_s %}
{% assign s_d = t_m_f_c| times: n_m %}
{% assign s_f = s_f_v | times: t_sea %}
    `;
    const graph = depGraph.createDependencyTree(expression);
    expect(Object.keys(graph).length).to.equal(16);
    expect(graph["m_f_p_s"].length).to.equal(4);
  });
});

describe("dependency-graph: Affected Variables", function () {
  it("Should have 3 affected variables", () => {
    const expression = `
    {% assign x = a + z %}
    {% assign y = a | times:2 %}   
    {% assign t = x | times: 3 %}
    `;
    const graph = depGraph.createDependencyTree(expression);
    const affectedVars = depGraph.getAffectedVariables(graph, "a");
    expect(affectedVars.length).to.equals(3);
  });

  it("Should handle complex assignments", () => {
    const expression = `
    {% if private_seats %}
    {% if yes_discounts_private_seats %}
    {% if p_s_p %}
        {% assign m_f_p_s_p_o = m_f_p_s | times: d_p_s_p %}
        {% assign m_f_p_s_p_t = m_f_p_s_p_o | divided_by: 100.00 %}
        {% assign m_f_p_s_p = m_f_p_s | minus: m_f_p_s_p_t %} 
        {% assign t_m_f_p_s = m_f_p_s_p | times: c_p_s %}
    {% else %}
        {% assign m_f_p_s_a_o = m_f_p_s | minus: d_s_p_s_a %}
        {% assign t_m_f_p_s = m_f_p_s_a_o | times: c_p_s %}
    {% endif %}
    {% else %}
    {% assign t_m_f_p_s = m_f_p_s | times: c_p_s %}
    {% endif %}
    {% else %}
    {% assign t_m_f_p_s = t_m_f_p_s | updateAttribute: "value", 0 %}
    {% endif %}
    {% assign t_m_f = t_m_f_d_d | plus: t_m_f_h_d %}
    {% assign t_m_f_c = t_m_f | plus: t_m_f_p_s %}
    {% assign s_d = t_m_f_c| times: n_m %}
    {% assign s_f = s_f_v | times: t_sea %}
    `;
    const graph = depGraph.createDependencyTree(expression);
    const affectedVars = depGraph.getAffectedVariables(graph, "m_f_p_s");
    /**
     * How 7?
     *
     *  When `m_f_p_s` is changed, it causes the following vars to change -
     *  - m_f_p_s_p_o
     *  -- m_f_p_s_p_t
     *  --- m_f_p_s_p
     *  ---- t_m_f_p_s
     *  ----- t_m_f_c
     *  ------ s_d
     *  - m_f_p_s_a_o
     *
     */
    expect(affectedVars.length).to.equal(7);
  });
});
