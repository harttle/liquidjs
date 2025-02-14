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

function docxHelper(ast, errorSet) {
  if (ast.type === 'LogicalExpression' || ast.type === 'BinaryExpression') {
    docxHelper(ast.left, errorSet)
    docxHelper(ast.right, errorSet)
  }

  else if (ast.type === 'Identifier' && ast.constant === false) {
    checkIdentifierExists(ast.name, ast.name, errorSet)
  }
}

function checkIdentifierExists(format_options, identifier, errorSet) {
  if (!format_options.hasOwnProperty(identifier)) {
    errorSet.add(`${identifier}`)
  }
}
function docxValidator(format_options, astArray) {
  let errorSet = new Set()
  astArray.forEach((ast) => {
    if (ast.type === "Identifier" && ast.constant === false) {
      checkIdentifierExists(format_options, ast.name, errorSet)
    }
    else {
      docxHelper(ast, errorSet)
    }
  })

  return errorSet;

}



// function checkVariableDefined() {
//   const engine = createEngine();
//   const expression = `
//   {% if x %}
//     {% if y %}
//       {% assign c = a | times: b %}
//     {% else %}
//       {% assign d = x | times: y %}
//     {% endif %}
// {% elsif x == "editor" %}
//     {% if y %}
//       {% assign c = a | times: b %}
//     {% else %}
//       {% assign d = x | times: y %}
//     {% endif %}
// {% else %}
//     {% if y %}
//       {% assign c = a | times: b %}
//     {% else %}
//       {% assign d = x | times: y %}
//     {% endif %}

// {% endif %}

//   `
//   const templates = getTemplates(expression, engine);

//   let assignedVars = new Set()
//   let errors = []

//   function validateVariable(tpl) {

//     const parsedObj = parseAssign(tpl, engine)

//     let cur_errors = []
//     parsedObj.dependsOn.forEach((varName) => {
//       if (!assignedVars.has(varName)) {
//         cur_errors.push(`Variable ${varName} used before assignment`)
//       }
//     })

//     errors.push(...cur_errors)
//     if (cur_errors.length == 0) {
//       assignedVars.add(parsedObj.defined)
//     }
//   }


//   templates.forEach((tpl) => {
//     if (!(tpl.type == 'tag' && (tpl.name == "assign" || tpl.name=="parseAssign" || tpl.name=="if"))) return;
//     if(tpl.name=="if"){
//       Object.entries(tpl.tagImpl).forEach(([key, value]) => {
//         if (key === 'branches') {
//           value.forEach((branch) => {
//             branch.templates.forEach((b) => {


//             });
//           });
//         }
//         else if (key === 'templates' || key === 'elseTemplates') {
//           value.forEach((tpl) => {
//             if(tpl.type!=='tag' || !tplName.has(tpl.name)) return;
//             const currentAssignedVar = tpl.tagImpl.key
//             const currentExpression = tpl.tagImpl.value
//             validateVariable(currentAssignedVar, currentExpression)

//           });
//         }
//       });
//     }

//     const currentAssignedVar = tpl.tagImpl.key
//     validateVariable(tpl, currentAssignedVar)



//   })

//   console.log(assignedVars);
//   console.log(errors);


// }

module.exports = {
  checkValidJSON,
  docxValidator
}