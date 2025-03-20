var depGraph = require("../dependency-graph");
const { getTemplates } = require("./utils");

/** checks if variables being used for computation have been defined before usage
 * Ex: For expression:  
 * {% if x %}
    {% if y %}
      {% assign c = x | times: b %}
 * Variable b is not defined so it will give error
 */
function checkVariableAssignedBeforeUsed(engine, expression) {
  const templates = getTemplates(engine, expression);
  let assignedVars = new Set(); // Track variables that have been assigned
  let errorsArr = []; // Store errors for undefined variable usage

  templates.forEach((tpl) => {
    if (tpl.type === "tag") {
      checkVariableInComputationHelper(engine, tpl, assignedVars, errorsArr);
    }
  });

  return errorsArr;
}

/**
 * Recursively checks variables in the computation.
 * Ensures variables are used only after they have been assigned.
 *
 * @param {Object} template - The current template node being processed
 * @param {Set} assignedVars - Set of variables that have been assigned so far
 */
function checkVariableInComputationHelper(
  engine,
  template,
  assignedVars,
  errorsArr
) {
  let currentSet = new Set(assignedVars);
  let curErrors = [];

  if (template.name === "if") {
    handleIf(engine, template, currentSet, errorsArr);
  } else if (template.name === "for") {
    handleFor(engine, template, currentSet, errorsArr);
  } else if (template.name === "assign" || template.name === "parseAssign") {
    const modifiedAssignedVars = handleAssign(
      engine,
      template,
      curErrors,
      assignedVars,
      currentSet
    );
    modifiedAssignedVars.forEach((item) => currentSet.add(item));
  }

  errorsArr.push(...curErrors);
}

/**
 * - Get variable used in if condition and add it to predefined vars set
 * - Ex: for the case if (x===some conditon), adds x to set
 * - passes this set to the next conditional branches
 * @param {*} currentSet - set of all variables defined up until the current if block
 */
function handleIf(engine, template, currentSet, errorsArr) {
  (template.tagImpl.branches ?? []).forEach((branch) => {
    currentSet.add(branch.cond[0]);
    branch.templates.forEach((tpl) => {
      handleTag(engine, tpl, currentSet, errorsArr);
    });
  });

  (template.tagImpl.elseTemplates ?? []).forEach((tpl) => {
    handleTag(engine, tpl, currentSet, errorsArr);
  });
}

/**
 * - Get variable used in if condition and add it to predefined vars set
 * - Ex: for the case if (x===some conditon), adds x to set
 * - passes this set to the next conditional branches
 * @param {*} currentSet - set of all variables defined up until the current if block
 */
function handleFor(engine, template, currentSet, errorsArr) {
  (template.tagImpl?.templates ?? []).forEach((tpl) => {
    handleTag(engine, tpl, currentSet, errorsArr);
  });

  (template.tagImpl?.elseTemplates ?? []).forEach((tpl) => {
    handleTag(engine, tpl, currentSet, errorsArr);
  });
}

/**
 * @param {*} assignedVars - set of all variables defined before the assign statement
 */
function handleAssign(engine, template, curErrors, assignedVars) {
  const parsedObj = depGraph.parseAssign(template, engine);

  (parsedObj.dependsOn ?? []).forEach((varName) => {
    if (!assignedVars.has(varName)) {
      curErrors.push(
        `Variable "${varName}" used before assignment in expression "${template.token.args}" on line ${template.token.line}`
      );
    }
  });

  if (curErrors.length === 0) {
    assignedVars.add(parsedObj.defined);
  }
  return assignedVars;
}

function isTemplateTypeTag(tpl) {
  return tpl.type === "tag";
}

/**
 * - recursively passes tag to helper function to process it further
 */
function handleTag(engine, tpl, currentSet, errorsArr) {
  if (isTemplateTypeTag(tpl)) {
    checkVariableInComputationHelper(engine, tpl, currentSet, errorsArr);
  }
}

module.exports = {
  checkVariableAssignedBeforeUsed,
};
