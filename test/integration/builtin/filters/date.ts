import { test, ctx } from '../../../stub/render'

describe('filters/date', function () {
  it('should support date: %a %b %d %Y', function () {
    const str = ctx.date.toDateString()
    return test('{{ date | date:"%a %b %d %Y"}}', str)
  })
  it('should create a new Date when given "now"', function () {
    return test('{{ "now" | date: "%Y"}}', (new Date()).getFullYear().toString())
  })
  it('should parse as Date when given UTC string', function () {
    return test('{{ "1991-02-22T00:00:00" | date: "%Y"}}', '1991')
  })
  it('should render string as string if not valid', function () {
    return test('{{ "foo" | date: "%Y"}}', 'foo')
  })
  it('should render object as string if not valid', function () {
    return test('{{ obj | date: "%Y"}}', '[object Object]')
  })
})
