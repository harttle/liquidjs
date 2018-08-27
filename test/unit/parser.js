import chai from 'chai'
import sinonChai from 'sinon-chai'
import Filter from '../../src/filter.js'
import Tag from '../../src/tag.js'
import Template from '../../src/parser.js'

const expect = chai.expect
const filter = Filter()
const tag = Tag()
chai.use(sinonChai)

describe('template', function () {
  let template
  const add = (l, r) => l + r

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
    const tpl = template.parseValue('foo')
    expect(tpl.type).to.equal('value')
    expect(tpl.initial).to.equal('foo')
    expect(tpl.filters).to.deep.equal([])
  })

  it('should parse value string with a simple filter', function () {
    const tpl = template.parseValue('foo | add: 3, "foo"')
    expect(tpl.initial).to.equal('foo')
    expect(tpl.filters.length).to.equal(1)
    expect(tpl.filters[0].filter).to.equal(add)
  })

  it('should parse value string with filters', function () {
    const tpl = template.parseValue('foo | add: "|" | add')
    expect(tpl.initial).to.equal('foo')
    expect(tpl.filters.length).to.equal(2)
  })
})
