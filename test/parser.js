const chai = require('chai')
const expect = chai.expect

chai.use(require('sinon-chai'))

let filter = require('../src/filter.js')()
let tag = require('../src/tag.js')()
let Template = require('../src/parser.js')

describe('template', function () {
  let template
  let add = (l, r) => l + r

  beforeEach(function () {
    filter.clear()
    filter.register('add', add)

    tag.clear()
    template = Template(tag, filter)
  })

  it('should throw when value string illegal', function () {
    expect(function () {
      template.parseValue('/')
    }).to.throw(/illegal value string/)
  })

  it('should parse value string', function () {
    let tpl = template.parseValue('foo')
    expect(tpl.type).to.equal('value')
    expect(tpl.initial).to.equal('foo')
    expect(tpl.filters).to.deep.equal([])
  })

  it('should parse value string with a simple filter', function () {
    let tpl = template.parseValue('foo | add: 3, "foo"')
    expect(tpl.initial).to.equal('foo')
    expect(tpl.filters.length).to.equal(1)
    expect(tpl.filters[0].filter).to.equal(add)
  })

  it('should parse value string with filters', function () {
    let tpl = template.parseValue('foo | add: "|" | add')
    expect(tpl.initial).to.equal('foo')
    expect(tpl.filters.length).to.equal(2)
  })
})
