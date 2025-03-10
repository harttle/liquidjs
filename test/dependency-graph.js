const chai = require("chai");
const sinonChai = require("sinon-chai");
const expect = chai.expect;
chai.use(sinonChai);

var depGraph = require("../dependency-graph");

describe("dependency-graph tests", () => {
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
    {% elsif p_s_p %}
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

    {% unless public_seats %}
    {% assign t_m_f = t_m_f_d_d | plus: t_m_f_h_d %}
    {% else %}

    {% assign t_m_f_c = t_m_f | plus: t_m_f_p_s %}
    {% endunless %}

    {% for row in allRows %}
    {% assign s_d = t_m_f_c| times: n_m %}
    {% assign s_f = s_f_v | times: t_sea %}
    {% endfor %}
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

  describe("dependency-graph: Cyclic Dependency", function () {
    it("Should handle checks with no cyclic dependency", () => {
      const expression = `
    {% assign x = a | plus: t %}
    {% assign y = a | times: t %}   
    {% assign z = t | times: 3 %}
    {% assign z = p | times: 3 %}
    {% assign p = q | times: 3 %}
    {% assign q = r | times: x %}
    `;
      const graph = depGraph.createDependencyTree(expression);
      const cycle = depGraph.checkForCyclicDependency(graph);
      expect(cycle).to.deep.equal([]);
    });

    it("Should handle simple cyclic dependency check", () => {
      // First line ceates cyclicity in the following expression
      const expression = `
    {% assign x = a | plus: z %}
    {% assign y = a | times: t %}   
    {% assign z = t | times: 3 %}
    {% assign z = p | times: 3 %}
    {% assign p = q | times: 3 %}
    {% assign q = r | times: x %}
    `;
      const graph = depGraph.createDependencyTree(expression);
      const cycle = depGraph.checkForCyclicDependency(graph);
      expect(cycle).to.deep.equal(["x", "z", "p", "q", "x"]);
      // Explanation
      // x depends on z -> (x = a | plus: z)
      // z depends on p -> (z = p | times: 3)
      // p depends on q -> (p = q | times: 3)
      // q depends on x -> (q = r | times: x)
    });

    it("Should handle self cyclic dependency check", () => {
      const expression = `
    {% assign x = x | plus:z %}
    `;
      const graph = depGraph.createDependencyTree(expression);
      const cycle = depGraph.checkForCyclicDependency(graph);
      expect(cycle).to.deep.equal(["x", "x"]);
    });

    it("Should handle complex cyclic dependency check", () => {
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
    {% assign t_m_f = t_m_f_d_d | plus: t_m_f_h_d %}
    {% endif %}
    {% assign t_m_f_c = t_m_f | plus: t_m_f_p_s %}
    {% assign m_f_p_s_p_o = t_m_f_c | plus: t_m_f_p_s %}
    {% assign s_d = t_m_f_c| times: n_m %}
    {% assign s_f = s_f_v | times: t_sea %}
    `;
      const graph = depGraph.createDependencyTree(expression);
      const cycle = depGraph.checkForCyclicDependency(graph);
      expect(cycle).to.deep.equal([
        "m_f_p_s_p_o",
        "t_m_f_c",
        "t_m_f_p_s",
        "m_f_p_s_p",
        "m_f_p_s_p_t",
        "m_f_p_s_p_o",
      ]);
      // Explanation
      // m_f_p_s_p_o depends on t_m_f_c -> (m_f_p_s_p_o = t_m_f_c | plus: t_m_f_p_s)
      // t_m_f_c depends on t_m_f_p_s -> (t_m_f_c = t_m_f | plus: t_m_f_p_s)
      // t_m_f_p_s depends on m_f_p_s_p -> (t_m_f_p_s = m_f_p_s_p | times: c_p_s)
      // m_f_p_s_p depends on m_f_p_s_p_t -> (m_f_p_s_p = m_f_p_s | minus: m_f_p_s_p_t)
      // m_f_p_s_p_t depends on m_f_p_s_p_o -> (m_f_p_s_p_t = m_f_p_s_p_o | divided_by: 100.00)
    });
  });

  describe("dependency-graph: Get Assigned Variables", function () {
    it(`should detect "assign" tag`, () => {
      const expression = `
    {% assign x = 100 %}
    {% assign y = a | plus: b %}
    `;
      const assignedVars = depGraph.getAssignedVariables(expression);
      expect(assignedVars).to.deep.equal(["x", "y"]);
    });

    it(`should detect "assignVar" tag`, () => {
      const expression = `
    {% assignVar y = a | plus: b %}
    `;
      const assignedVars = depGraph.getAssignedVariables(expression);
      expect(assignedVars).to.deep.equal(["y"]);
    });

    it(`should detect "parseAssign" tag`, () => {
      const expression = `
    {% parseAssign x = "100" %}
    {% assign y = '{"value": 0, "type": "USD"}' %}
    `;
      const assignedVars = depGraph.getAssignedVariables(expression);
      expect(assignedVars).to.deep.equal(["x", "y"]);
    });

    it(`should detect inside "if" tag`, () => {
      const expression = `
    {% if a == "USD" %}
      {% parseAssign x1 = "100" %}
      {% assign y1 = p %}
      {% assign z1 = p %}
    {% elsif a == "INR" %}
      {% parseAssign x2 = "100" %}
      {% assign y2 = p %}
      {% assign z2 = p %}
    {% else %}
      {% parseAssign x3 = "100" %}
      {% assign y3 = p %}
      {% assign z3 = p %}
    {% endif %}
    `;
      const assignedVars = depGraph.getAssignedVariables(expression);
      expect(assignedVars).to.deep.equal([
        "x1",
        "y1",
        "z1",
        "x2",
        "y2",
        "z2",
        "x3",
        "y3",
        "z3",
      ]);
    });

    it(`should detect inside "unless" tag`, () => {
      const expression = `
    {% unless a == "USD" %}
      {% parseAssign x1 = "100" %}
      {% assign y1 = p %}
      {% assign z1 = p %}
    {% else %}
      {% parseAssign x2 = "100" %}
      {% assign y2 = p %}
      {% assign z2 = p %}
    {% endunless %}
    `;
      const assignedVars = depGraph.getAssignedVariables(expression);
      expect(assignedVars).to.deep.equal(["x1", "y1", "z1", "x2", "y2", "z2"]);
    });

    it(`should detect inside "for" tag`, () => {
      const expression = `
    {% for row in allRows %}
      {% parseAssign x1 = "100" %}
      {% assign y1 = p %}
      {% assign z1 = p %}
    {% endfor %}
    `;
      const assignedVars = depGraph.getAssignedVariables(expression);
      expect(assignedVars).to.deep.equal(["x1", "y1", "z1"]);
    });

    it(`should detect in complex expressions`, () => {
      const expression = `
    {% parseAssign x0 = "100" %}
    {% assign y0 = p %}
    {% assign z0 = p %}

    {% if a == "USD" %}
      {% parseAssign x1 = "100" %}
      {% assign y1 = p %}
      {% assign z1 = p %}
    {% elsif a == "INR" %}
      {% parseAssign x2 = "100" %}
      {% assign y2 = p %}
      {% assign z2 = p %}
    {% else %}
      {% parseAssign x3 = "100" %}
      {% assign y3 = p %}
      {% assign z3 = p %}
    {% endif %}

    {% unless a == "USD" %}
      {% parseAssign x4 = "100" %}
      {% assign y4 = p %}
      {% assign z4 = p %}
    {% else %}
      {% parseAssign x5 = "100" %}
      {% assign y5 = p %}
      {% assign z5 = p %}
    {% endunless %}
    
    {% for row in allRows %}
      {% parseAssign x6 = "100" %}
      {% assign y6 = p %}
      {% assign z6 = p %}
    {% endfor %}
    `;
      const assignedVars = depGraph.getAssignedVariables(expression);
      expect(assignedVars).to.deep.equal([
        "x0",
        "y0",
        "z0",
        "x1",
        "y1",
        "z1",
        "x2",
        "y2",
        "z2",
        "x3",
        "y3",
        "z3",
        "x4",
        "y4",
        "z4",
        "x5",
        "y5",
        "z5",
        "x6",
        "y6",
        "z6",
      ]);
    });
  });
});
