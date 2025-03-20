const { checkValidJSON } = require("./validations/checkValidJson");
const {
  checkAtleastOneDynamicTableAssignPresent,
} = require("./validations/computeColumn");

const {
  checkVariableAssignedBeforeUsed,
} = require("./validations/checkVariableAssignedBeforeUsed");

module.exports = {
  checkValidJSON,
  checkVariableAssignedBeforeUsed,
  checkAtleastOneDynamicTableAssignPresent,
};
