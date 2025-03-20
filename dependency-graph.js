const Lexical = require("./src/lexical");

function createEngine() {
  const Liquid = require("./index"); //moved this here to prevent cyclic dependency
  return Liquid({});
}

function getTemplates(expression, engine) {
  const templates = engine.parse(expression);
  return templates;
}

/**
 *
 * Returns a JSON Friendly object where keys are the variables and the values
 * is an array of variables that are affected by these variables.
 *
 * For example
 *
 * ```
 *   assign x = y + z
 *   assign a = y | times:2
 * ```
 *
 * will produce
 * ```
 * {
 *   y: [x, a],
 *   z: [x]
 * }
 * ```
 * @param text - the entire text
 */
function createDependencyTree(text) {
  const engine = createEngine();
  const templates = getTemplates(text, engine);
  const graph = {};
  templates.forEach(function (tpl) {
    parseTemplate(tpl, engine, graph);
  });
  return graph;
}

/**
 * Parses the different kinds of templates (assign, if).
 * This function mutates the @param graph and directly appends values
 * to it.
 *
 * @param {*} template
 * @param {*} engine
 * @param {*} graph = the current dependency graph
 */
function parseTemplate(template, engine, graph) {
  if (
    template.name === "assign" ||
    template.name === "parseAssign" ||
    template.name === "assignVar"
  ) {
    const dependencyData = parseAssign(template, engine);
    dependencyData.dependsOn.forEach(function (dependency) {
      const affectedVariables = graph[dependency] || [];
      if (!affectedVariables.includes(dependencyData.defined)) {
        affectedVariables.push(dependencyData.defined);
      }
      graph[dependency] = affectedVariables;
    });
  } else if (template.name === "if") {
    parseIf(template, engine, graph, parseTemplate);
  } else if (template.name === "unless") {
    parseUnless(template, engine, graph, parseTemplate);
  } else if (template.name === "for") {
    parseFor(template, engine, graph, parseTemplate);
  }
}

/**
 * Returns an array where the first item is the variable assigned
 * and the rest of the items are the variables used to define it.
 *
 * Literals are not returned.
 *
 * @param {*} assignTemplate : The template object representing an Assign tag
 * @param {*} engine: The liquid engine instance
 *
 * @returns
 * ```
 * {
 *  // the variable defined
 *  defined,
 *  // the variables that the defined variable depends on (does not contain literals)
 *  dependsOn
 * }
 * ```
 *
 */
function parseAssign(assignTemplate, engine) {
  // For an expression assign x = y | times: 3
  // definedVar = x
  const definedVar = assignTemplate.tagImpl.key;
  const valueToken = engine.parser.parseValue(assignTemplate.tagImpl.value);
  let variables = [];
  if (valueToken.filters) {
    // initial is the primary value on which operators work.
    // eg: x = y | times: 3; initial = y, but for x = 100 | times: y
    // initial = 100. This is why we check if initial is not a literal.
    if (!Lexical.isLiteral(valueToken.initial)) {
      variables.push(valueToken.initial);
    }
    valueToken.filters.forEach((filter) => {
      // Multiple filters can have multiple arguments that may or may not variables.
      const notLiterals = filter.args.filter((arg) => {
        return !Lexical.isLiteral(arg);
      });
      variables = [...variables, ...notLiterals];
    });
  }
  return {
    defined: definedVar,
    dependsOn: variables,
  };
}

function parseIf(ifTemplate, engine, accumulator, callback) {
  const impl = ifTemplate.tagImpl;
  impl.branches.forEach(function (branch) {
    branch.templates.forEach(function (tpl) {
      callback(tpl, engine, accumulator);
    });
  });
  impl.elseTemplates.forEach(function (tpl) {
    callback(tpl, engine, accumulator);
  });
}

function parseUnless(unlessTemplate, engine, accumulator, callback) {
  const impl = unlessTemplate.tagImpl;
  impl.templates.forEach(function (tpl) {
    callback(tpl, engine, accumulator);
  });
  impl.elseTemplates.forEach(function (tpl) {
    callback(tpl, engine, accumulator);
  });
}

function parseFor(forTemplate, engine, accumulator, callback) {
  const impl = forTemplate.tagImpl;
  impl.templates.forEach(function (tpl) {
    callback(tpl, engine, accumulator);
  });
  impl.elseTemplates.forEach(function (tpl) {
    callback(tpl, engine, accumulator);
  });
}

/**
 * The actual method that is called recursively till we figure out
 * all the variables affected by a change.
 *
 * Note: The tree is mutated in-place.
 */
function _internal_getAffectedVariables(tree, inputVar, values) {
  function hasDependenantVars(variable) {
    const items = tree[variable];
    return items && items.length > 0;
  }
  const topLevel = tree[inputVar];
  if (!hasDependenantVars(inputVar)) {
    return [];
  }
  topLevel
    // this filter is necessary to prevent infinite loops
    .filter((variable) => variable !== inputVar)
    .forEach(function (variable) {
      values.push(variable);
      // if the given variable has any other dependencies,
      // then get those variables too.
      if (hasDependenantVars(variable)) {
        const _affected = _internal_getAffectedVariables(
          tree,
          variable,
          values
        );
        values = [...values, ..._affected];
      }
    });
  return values;
}

/**
 *
 * Returns a list of all variables affected by input variable.
 * Example -
 *
 * ```
 *  assign x = a + z
 *  assign y = a | times:2
 *  assign t = x | times: 3
 * ```
 *
 * for `getAffectedVariables(a)` returns => `[x,y,t]`
 *
 * @param tree : The dependency tree created using `createDependencyTree`
 * @param inputVar : The variable to check
 */
function getAffectedVariables(tree, inputVar) {
  const values = _internal_getAffectedVariables(tree, inputVar, []);
  return Array.from(new Set(values));
}

/**
 * Checks for cyclic dependency in the input graph.
 * Returns the cyclic path if found otherwise returns `[]`
 *
 * Iterate over all keys in the graph and run `dfs()`.
 * If a cycle is found, error will be thrown and further execution stop.
 * In case of error, `.pop()` won't be called after any `dfs()`, so `cycle` array will have the cyclic path.
 *
 * @param {*} graph The dependency tree created using `createDependencyTree`
 * @return {*}
 */
function checkForCyclicDependency(graph) {
  let cycle = [];
  const UNVISITED = 0;
  const VISITING = 1;
  const VISITED = 2;
  const statusMap = new Map(Object.keys(graph).map((key) => [key, UNVISITED]));

  /**
   * Utility function for depth first search.
   * Updates `cycle` to keep track of potential circular dependency.
   *
   * @param {unknown} node The node to visit
   * @param {*} neighbours The neighbours of the node being visited
   * @return {undefined} Nothing is returned
   * @throws {Error} If a cycle is encountered while doing DFS
   */
  function dfs(node, neighbours) {
    if (statusMap.get(node) === VISITED) {
      return;
    }

    if (statusMap.get(node) === VISITING) {
      throw new Error("The graph contains cyclic dependency for " + node);
    }

    statusMap.set(node, VISITING);

    neighbours.forEach((neighbour) => {
      cycle.push(neighbour);
      dfs(neighbour, graph[neighbour] || []);
      cycle.pop();
    });

    statusMap.set(node, VISITED);
  }

  // By using try-catch, we stop error from going up the chain any more and return cycle array
  const entries = Object.entries(graph);
  try {
    entries.forEach(([node, neighbours]) => {
      if (statusMap.get(node) === UNVISITED) {
        cycle.push(node);
        dfs(node, neighbours);
        cycle.pop();
      }
    });
  } catch (error) {
    if (cycle.length) {
      // currently cycle contains the entire dfs path
      // we need to extract only the cyclic path
      const cyclicityStartIndex = cycle.indexOf(cycle[cycle.length - 1]);
      cycle = cycle.slice(cyclicityStartIndex);
    }
  }
  // since dependency graph is of format baseVar -> [vars affected by baseVar]
  // we need to reverse the cycle array to get a more intuitive cylclic path
  return cycle.reverse();
}

/**
 * The actual method that is called recursively till we figure out
 * all the variables that are assigned a value.
 *
 * Note: The `assignedVarsArr` arg is mutated in-place.
 */
function _internal_getAssignedVars(template, engine, assignedVarsArr) {
  if (
    template.name === "assign" ||
    template.name === "parseAssign" ||
    template.name === "assignVar"
  ) {
    const dependencyData = parseAssign(template, engine);
    if (
      typeof dependencyData.defined === "string" &&
      dependencyData.defined.length > 0
    ) {
      assignedVarsArr.push(dependencyData.defined);
    }
  } else if (template.name === "if") {
    parseIf(template, engine, assignedVarsArr, _internal_getAssignedVars);
  } else if (template.name === "unless") {
    parseUnless(template, engine, assignedVarsArr, _internal_getAssignedVars);
  } else if (template.name === "for") {
    parseFor(template, engine, assignedVarsArr, _internal_getAssignedVars);
  }
}

/**
 * Returns a list of all variables that are assigned a value in the given computation expression.
 * If any of `assign`, `parseAssign` or `assignVar` tags are used, it is considered an assignment.
 *
 * Example -
 * ```
 *  assign x = a + z
 *
 *
 *  if p > q
 *  assignVar y = x | times: 3
 *  endif
 *
 *  for row in allRows
 *  parseAssign z = '{"value": 0, "type": "USD"}'
 *  endfor
 *
 * ```
 *
 * for `getAssignedVariables()` returns => `[x,y,z]`
 *
 * @param expression : The liquid expression string that needs to be analyzed
 */
function getAssignedVariables(expression) {
  const engine = createEngine();
  const templates = getTemplates(expression, engine);
  const assignedArr = [];

  templates.forEach(function (tpl) {
    _internal_getAssignedVars(tpl, engine, assignedArr);
  });

  return Array.from(new Set(assignedArr));
}

module.exports = {
  parseAssign,
  getTemplates,
  createEngine,
  createDependencyTree,
  getAffectedVariables,
  checkForCyclicDependency,
  getAssignedVariables,
};
