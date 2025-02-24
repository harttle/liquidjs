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



module.exports = {
  checkValidJSON,
  docxValidator
}