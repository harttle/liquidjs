const { readFileSync } = require('fs')
const { join } = require('path')

function createEngine (pkg) {
  const liquid = new pkg.Liquid({
    root: join(__dirname, '../templates'),
    cache: true,
    extname: '.liquid'
  })
  liquid.registerFilter('url', path => `http://example.com${path}`)
  return {
    load: path => liquid.parse(readFileSync(path + '.liquid', 'utf8')),
    render: (tpl, data) => liquid.renderSync(tpl, data)
  }
}

module.exports = { createEngine }
