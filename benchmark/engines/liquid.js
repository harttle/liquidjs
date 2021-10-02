const { createEngine } = require('./create-liquid')

module.exports = createEngine(require('../../dist/liquid.node.cjs'))
