import { test } from '../../../stub/render'

describe('filters/date', function () {
  it('should support date: %a %b %d %Y', function () {
    const date = new Date()
    return test('{{ date | date:"%a %b %d %Y"}}', { date }, date.toDateString())
  })
  it('should create a new Date when given "now"', function () {
    return test('{{ "now" | date: "%Y"}}', (new Date()).getFullYear().toString())
  })
  it('should create a new Date when given "today"', function () {
    return test('{{ "today" | date: "%Y"}}', (new Date()).getFullYear().toString())
  })
  it('should parse as Date when given UTC string', function () {
    return test('{{ "1991-02-22T00:00:00" | date: "%Y"}}', '1991')
  })
  it('should render string as string if not valid', function () {
    return test('{{ "foo" | date: "%Y"}}', 'foo')
  })
  it('should render object as string', function () {
    return test('{{ obj | date: "%Y"}}', { obj: {} }, '[object Object]')
  })
  it('should create from number', async function () {
    const time = new Date('2017-03-07T12:00:00').getTime() / 1000
    return test('{{ time | date: "%Y-%m-%dT%H:%M:%S" }}', { time }, '2017-03-07T12:00:00')
  })
  it('should create from number-like string', async function () {
    const time = String(new Date('2017-03-07T12:00:00').getTime() / 1000)
    return test('{{ time | date: "%Y-%m-%dT%H:%M:%S" }}', { time }, '2017-03-07T12:00:00')
  })
  it('should support manipulation', async function () {
    return test('{{ date | date: "%s" | minus : 604800  | date: "%Y-%m-%dT%H:%M:%S"}}',
      { date: new Date('2017-03-07T12:00:00') },
      '2017-02-28T12:00:00'
    )
  })
})
