const { Liquid } = require('../..')
const { readFileSync } = require('fs')
const { join } = require('path')

const liquid = new Liquid({
  root: join(__dirname, '../templates'),
  cache: true,
  extname: '.liquid'
})

liquid.registerFilter('url', path => `http://example.com${path}`)

module.exports = {
  load: path => liquid.parse(readFileSync(path + '.liquid', 'utf8')),
  render: (tpl, data) => liquid.renderSync(tpl, data)
}
