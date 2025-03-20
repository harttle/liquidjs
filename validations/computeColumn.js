const { getTemplates } = require("./utils");

/**
 - checks if valid dynamic table by looking for presence of atleast one $$answer = something which is not present inside any loop or conditional blocks
 - adds errors to validation errors array
 * @param {*} expression - liquid expression
 */
function checkAtleastOneDynamicTableAssignPresent(engine, expression) {
  const validationErrors = [];
  const templates = getTemplates(engine, expression);

  const dynamicTableTags = templates.filter(
    (tpl) => tpl.type === "tag" && tpl.name === "computeColumn"
  );

  dynamicTableTags.forEach((table) => {
    if (
      table.tagImpl &&
      !checkIfTargetStatementExists(table.tagImpl.templates)
    ) {
      validationErrors.push({
        message:
          "$$answer is not assigned outside any loops or condition block",
        metadata: {
          tableName: table.tagImpl?.tableName,
          columnName: table.tagImpl?.columnName,
        },
      });
    }
  });

  return validationErrors;
}

/**
 * - checks if there is atleast one tag with $$ answer assignment which is not inside any loops or conditional blocks
 */
function checkIfTargetStatementExists(templates) {
  return (templates ?? []).some((tpl) => {
    return (
      tpl.type === "tag" &&
      tpl.name === "assign" &&
      tpl.tagImpl?.key?.trim() === "$$answer"
    );
  });
}

module.exports = {
  checkAtleastOneDynamicTableAssignPresent,
};
