const swig = require('swig')

swig.setFilter('url', function (path) {
  return `http://example.com${path}`
})

swig.setFilter('prepend', function (input, arg) {
  return arg + input
})

swig.setFilter('append', function (input, arg) {
  return input + arg
})

swig.setFilter('inc', function (num) {
  return Number(num) + 1
})

swig.setFilter('capitalize', function (str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase()
})

swig.setFilter('upcase', function (str) {
  return str.toUpperCase()
})

module.exports = {
  load: path => swig.compileFile(path + '.swig'),
  render: (tpl, data) => tpl(data)
}
