const { parseAssign } = require("./dependency-graph");
const Liquid = require("./index");
function createEngine() {
  return Liquid({});
}

function getTemplates(expression, engine) {
  const templates = engine.parse(expression);
  return templates;
}


function checkValidJSON(expression) {
  const engine = createEngine();
  const templates = getTemplates(expression, engine);
  let validationErrors = [];

  function validateJSON(value) {
    try {
      const trimmedValue = value.trim();
      const evalValue = engine.evalValue(trimmedValue, {});
      const jsonStr = `{"val": ${evalValue}}`;
      JSON.parse(jsonStr);
    } catch (e) {
      validationErrors.push(`Invalid JSON: ${e.message}`);
    }
  }

  function processTemplates(templates) {
    templates.forEach((tpl) => {
      if (tpl.type === 'tag' && tpl.name === 'parseAssign') {
        processTagImpl(tpl.tagImpl);
      }
    });
  }

  function processTagImpl(tagImpl) {
    Object.entries(tagImpl).forEach(([key, value]) => {
      if (key === 'key') {
        validateJSON(tagImpl.value);
      } else if (key === 'branches') {
        value.forEach((branch) => processTemplates(branch.templates));
      } else if (key === 'templates' || key === 'elseTemplates') {
        processTemplates(value);
      }
    });
  }

  processTemplates(templates);
  return validationErrors;
}

/** checks if variables being used for computation have been defined before usage
 * Ex: For expression:  
 * {% if x %}
    {% if y %}
      {% assign c = x | times: b %}
 * Variable b is not defined so it will give error
 */
function checkVariableInComputation(expression) {
  const engine = createEngine();

  const templates = getTemplates(expression, engine);
  let assignedVars = new Set(); // Track variables that have been assigned
  let errorsArr = []; // Store errors for undefined variable usage

  /**
   * Recursively checks variables in the computation.
   * Ensures variables are used only after they have been assigned.
   * 
   * @param {Object} template - The current template node being processed
   * @param {Set} assignedVars - Set of variables that have been assigned so far
   */
  function checkVariableInComputationHelper(template, assignedVars) {
    const currentSet = new Set(assignedVars);
    let curErrors = [];

    if (template.name === "if") {
      /**
       * Get variable used in if condition and add it to predefined vars set 
       * Ex: for the case if (x===some conditon), adds x to set
       */
      const conditionVar = template.token?.args;
      if (conditionVar) currentSet.add(conditionVar);

      /**
       * Recursively calls helper function and passes templates of type tag and predefined variables set
       */
      Object.entries(template.tagImpl).forEach(([key, value]) => {
        if (key === "branches") {
          value.forEach((branch) => {
            currentSet.add(branch.cond[0]);
            branch.templates.forEach((tpl) => {
              if (tpl.type === "tag") {
                checkVariableInComputationHelper(tpl, currentSet);
              }
            });
          });
        } else if (key === "elseTemplates") {
          // Handle 'else' block
          value.forEach((tpl) => {
            if (tpl.type === "tag") {
              checkVariableInComputationHelper(tpl, currentSet);
            }
          });
        }
      });

    } else if (template.name === "assign") {

      const parsedObj = parseAssign(template, engine);

      parsedObj.dependsOn.forEach((varName) => {
        if (!assignedVars.has(varName)) {
          curErrors.push(
            `Variable "${varName}" used before assignment in expression "${template.token.args}" on line ${template.token.line}`
          );
        }
      });

      // If there are no errors, add the newly defined variable to the set
      if (curErrors.length === 0) {
        assignedVars.add(parsedObj.defined);
      }
    }

    errorsArr.push(...curErrors);
  }

  templates.forEach((tpl) => {
    if (tpl.type === "tag") {
      checkVariableInComputationHelper(tpl, assignedVars);
    }
  });

  return errorsArr;
}





module.exports = {
  checkValidJSON,
  checkVariableInComputation,
}