import { test, ctx } from '../../../stub/render'
import { expect } from 'chai'
import { Liquid } from '../../../../src/liquid'

describe('filters/date', function () {
  let liquid: Liquid
  beforeEach(function () {
    liquid = new Liquid()
  })
  it('should support date: %a %b %d %Y', function () {
    const str = ctx.date.toDateString()
    return test('{{ date | date:"%a %b %d %Y"}}', str)
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
  it('should render object as string if not valid', function () {
    return test('{{ obj | date: "%Y"}}', '[object Object]')
  })
  it('should create from number', async function () {
    const time = new Date('2017-03-07T12:00:00').getTime() / 1000
    const src = '{{ time | date: "%Y-%m-%dT%H:%M:%S" }}'
    const ctx = { time }
    const dst = '2017-03-07T12:00:00'
    expect(await liquid.parseAndRender(src, ctx)).to.equal(dst)
  })
  it('should create from number-like string', async function () {
    const time = String(new Date('2017-03-07T12:00:00').getTime() / 1000)
    const src = '{{ time | date: "%Y-%m-%dT%H:%M:%S" }}'
    const ctx = { time }
    const dst = '2017-03-07T12:00:00'
    expect(await liquid.parseAndRender(src, ctx)).to.equal(dst)
  })
  it('should support manipulation', async function () {
    const src = '{{ date | date: "%s" | minus : 604800  | date: "%Y-%m-%dT%H:%M:%S"}}'
    const ctx = { date: new Date('2017-03-07T12:00:00') }
    const dst = '2017-02-28T12:00:00'
    expect(await liquid.parseAndRender(src, ctx)).to.equal(dst)
  })
})
