const { checkValidJSON } = require("./validations/checkValidJson");
const {
  checkAtleastOneDynamicTableAssignPresent,
} = require("./validations/computeColumn");

module.exports = {
  checkValidJSON,
  checkAtleastOneDynamicTableAssignPresent,
};
