function getTemplates(engine, expression) {
  const templates = engine.parse(expression);
  return templates;
}

module.exports = {
  getTemplates,
};
