const Lexical = require("../src/lexical");
const { getTemplates } = require("./utils");

/**
 - Validates if the given value can be parsed as JSON.
 - If the value is invalid, an error message is added to the validationErrors array.
 * @param {*} tpl - astObject
 * @param {*} value - value assigned to parseAssign statement
 */
function validateJSON(engine, tpl, value, validationErrors) {
  try {
    const trimmedValue = value.trim();

    if (!Lexical.isLiteral(trimmedValue)) {
      throw new Error("Invalid value assigned to parseAssign statement");
    }
    const evalValue = engine.evalValue(trimmedValue, {});
    const jsonStr = `{"val": ${
      typeof evalValue === "string" ? JSON.stringify(evalValue) : evalValue
    }}`;

    JSON.parse(jsonStr);
  } catch (e) {
    validationErrors.push({
      expression: `${tpl.name} ${tpl.tagImpl.key} = ${tpl.tagImpl.value}`,
      errorMessage: `${e.message} at line ${tpl.token.line}`,
    });
  }
}

function parseIf(ifTemplate, callback) {
  const impl = ifTemplate.tagImpl;
  impl.branches.forEach(function (branch) {
    callback(branch.templates);
  });
  if (impl.elseTemplates) {
    callback(impl.elseTemplates);
  }
}

function parseForOrUnless(forTemplate, callback) {
  const impl = forTemplate.tagImpl;
  if (impl.templates) {
    callback(impl.templates);
  }
  if (impl.elseTemplates) {
    callback(impl.elseTemplates);
  }
}

/**
 - checks if valid JSON object has been passed to parseAssign statement
 - adds errors to validation errors array
 * @param {*} expression - liquid expression
 */
function checkValidJSON(engine, expression) {
  const templates = getTemplates(engine, expression);
  let validationErrors = [];

  function processTemplates(templates) {
    templates.forEach((tpl) => {
      if (tpl.name === "parseAssign") {
        validateJSON(engine, tpl, tpl.tagImpl.value, validationErrors);
      } else if (tpl.name === "if") {
        parseIf(tpl, processTemplates);
      } else if (tpl.name === "for" || tpl.name === "unless") {
        parseForOrUnless(tpl, processTemplates);
      }
    });
  }

  processTemplates(templates);
  return validationErrors;
}

module.exports = {
  checkValidJSON,
};
