const handlebars = require('handlebars')
const { readFileSync } = require('fs')
const { join } = require('path')

handlebars.registerPartial(
  'todo-icon',
  readFileSync(join(__dirname, '../templates/todo-icon.hbs'), 'utf8')
)

handlebars.registerHelper('concat', function (...args) {
  return args.filter(x => typeof x === 'string').join('')
})

handlebars.registerHelper('url', function (path) {
  return `http://example.com${path}`
})

handlebars.registerHelper('inc', function (num) {
  return Number(num) + 1
})

handlebars.registerHelper('capitalize', function (str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase()
})

handlebars.registerHelper('upcase', function (str) {
  return str.toUpperCase()
})

module.exports = {
  load: path => handlebars.compile(readFileSync(path + '.hbs', 'utf8')),
  render: (tpl, data) => tpl(data)
}
