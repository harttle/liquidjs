import { LiquidOptions } from '../../../src/liquid-options'
import { Liquid } from '.././../../src/liquid'
import { test } from '../../stub/render'
import { disableIntl } from '../../stub/no-intl'

describe('filters/date', function () {
  const liquid = new Liquid({ locale: 'en-US' })

  describe('constructor', () => {
    it('should create a new Date when given "now"', function () {
      return test('{{ "now" | date: "%Y"}}', (new Date()).getFullYear().toString())
    })
    it('should create a new Date when given "today"', function () {
      return test('{{ "today" | date: "%Y"}}', (new Date()).getFullYear().toString())
    })
    it('should create from number', async function () {
      const time = new Date('2017-03-07T12:00:00').getTime() / 1000
      return test('{{ time | date: "%Y-%m-%dT%H:%M:%S" }}', { time }, '2017-03-07T12:00:00')
    })
    it('should create from number-like string', async function () {
      const time = String(new Date('2017-03-07T12:00:00').getTime() / 1000)
      return test('{{ time | date: "%Y-%m-%dT%H:%M:%S" }}', { time }, '2017-03-07T12:00:00')
    })
    it('should treat nil as 0', () => {
      expect(liquid.parseAndRenderSync('{{ nil | date: "%Y-%m-%dT%H:%M:%S", "Asia/Shanghai" }}')).toEqual('1970-01-01T08:00:00')
    })
    it('should treat undefined as invalid', () => {
      expect(liquid.parseAndRenderSync('{{ num | date: "%Y-%m-%dT%H:%M:%S", "Asia/Shanghai" }}', { num: undefined })).toEqual('')
    })
  })

  it('should support date: %a %b %d %Y', function () {
    const date = new Date()
    return test('{{ date | date:"%a %b %d %Y"}}', { date }, date.toDateString())
  })
  describe('%a', () => {
    it('should support short week day', () => {
      const tpl = '{{ "2024-07-21T20:24:00.000Z" | date: "%a", "Asia/Shanghai" }}'
      expect(liquid.parseAndRenderSync(tpl)).toEqual('Mon')
    })
    it('should support short week day with timezone', () => {
      const tpl = '{{ "2024-07-21T20:24:00.000Z" | date: "%a", "America/New_York" }}'
      expect(liquid.parseAndRenderSync(tpl)).toEqual('Sun')
    })
    it('should support short week day with locale', () => {
      const liquid = new Liquid({ locale: 'zh-CN' })
      const tpl = '{{ "2024-07-21T20:24:00.000Z" | date: "%a", "America/New_York" }}'
      expect(liquid.parseAndRenderSync(tpl)).toEqual('周日')
    })
  })
  describe('%b', () => {
    it('should support short month', () => {
      const tpl = '{{ "2024-07-31T20:24:00.000Z" | date: "%b", "Asia/Shanghai" }}'
      expect(liquid.parseAndRenderSync(tpl)).toEqual('Aug')
    })
    it('should support short week day with locale', () => {
      const liquid = new Liquid({ locale: 'zh-CN' })
      const tpl = '{{ "2024-07-31T20:24:00.000Z" | date: "%b", "Asia/Shanghai" }}'
      expect(liquid.parseAndRenderSync(tpl)).toEqual('8月')
    })
  })
  describe('Intl compatibility', () => {
    disableIntl()
    it('should use English if Intl not supported', () => {
      const liquid = new Liquid()
      const tpl = '{{ "2024-07-31T20:24:00.000Z" | date: "%b", "Asia/Shanghai" }}'
      expect(liquid.parseAndRenderSync(tpl)).toEqual('Aug')
    })
    it('should use English if Intl not supported even for other locales', () => {
      const liquid = new Liquid({ locale: 'zh-CN' })
      const tpl = '{{ "2024-07-31T20:24:00.000Z" | date: "%b", "Asia/Shanghai" }}'
      expect(liquid.parseAndRenderSync(tpl)).toEqual('Aug')
    })
  })
  it('should support "now"', function () {
    // sample: Thursday, February 2, 2023 at 6:25 pm +0000
    return test('{{ "now" | date }}', /\w+, \w+ \d+, \d\d\d\d at \d+:\d\d [ap]m [-+]\d\d\d\d/)
  })
  it('should parse as Date when given a timezoneless string', function () {
    return test('{{ "1991-02-22T00:00:00" | date: "%Y-%m-%dT%H:%M:%S"}}', '1991-02-22T00:00:00')
  })
  describe('when preserveTimezones is enabled', function () {
    const opts: LiquidOptions = { preserveTimezones: true }

    it('should not change the timezone between input and output', function () {
      return test('{{ "1990-12-31T23:00:00Z" | date: "%Y-%m-%dT%H:%M:%S"}}', '1990-12-31T23:00:00', undefined, opts)
    })
    it('should apply numeric timezone offset (0)', function () {
      return test('{{ "1990-12-31T23:00:00+00:00" | date: "%Y-%m-%dT%H:%M:%S"}}', '1990-12-31T23:00:00', undefined, opts)
    })
    it('should apply numeric timezone offset (-1)', function () {
      return test('{{ "1990-12-31T23:00:00-01:00" | date: "%Y-%m-%dT%H:%M:%S"}}', '1990-12-31T23:00:00', undefined, opts)
    })
    it('should apply numeric timezone offset (+2.30)', function () {
      return test('{{ "1990-12-31T23:00:00+02:30" | date: "%Y-%m-%dT%H:%M:%S"}}', '1990-12-31T23:00:00', undefined, opts)
    })
    it('should automatically work when timezone not specified', function () {
      return test('{{ "1990-12-31T23:00:00" | date: "%Y-%m-%dT%H:%M:%S"}}', '1990-12-31T23:00:00', undefined, opts)
    })
  })
  it('should render string as string if not valid', function () {
    return test('{{ "foo" | date: "%Y"}}', 'foo')
  })
  it('should render object as string', function () {
    return test('{{ obj | date: "%Y"}}', { obj: {} }, '[object Object]')
  })
  it('should support manipulation', async function () {
    return test('{{ date | date: "%s" | minus : 604800  | date: "%Y-%m-%dT%H:%M:%S"}}',
      { date: new Date('2017-03-07T12:00:00') },
      '2017-02-28T12:00:00'
    )
  })
  describe('timezoneOffset', function () {
    // -06:00
    const opts: LiquidOptions = { timezoneOffset: 360 }

    it('should offset UTC date literal', function () {
      return test('{{ "1990-12-31T23:00:00Z" | date: "%Y-%m-%dT%H:%M:%S"}}', '1990-12-31T17:00:00', undefined, opts)
    })
    it('should support timezone offset argument', function () {
      return test('{{ "1990-12-31T23:00:00Z" | date: "%Y-%m-%dT%H:%M:%S", 360}}', '1990-12-31T17:00:00')
    })
    it('should support timezone without format', function () {
      return test('{{ "2022-12-08T03:22:18.000Z" | date: nil, "America/Cayman" }}', 'Wednesday, December 7, 2022 at 10:22 pm -0500')
    })
    it('should support timezone name argument', function () {
      return test('{{ "1990-12-31T23:00:00Z" | date: "%Y-%m-%dT%H:%M:%S", "Asia/Colombo" }}', '1991-01-01T04:30:00')
    })
    it('should support timezone name argument when DST is not active', function () {
      return test('{{ "2021-01-01T23:00:00Z" | date: "%Y-%m-%dT%H:%M:%S", "America/New_York" }}', '2021-01-01T18:00:00')
    })
    it('should support timezone name argument when DST is active', function () {
      return test('{{ "2021-06-01T23:00:00Z" | date: "%Y-%m-%dT%H:%M:%S", "America/New_York" }}', '2021-06-01T19:00:00')
    })
    it('should offset date literal with timezone 00:00 specified', function () {
      return test('{{ "1990-12-31T23:00:00+00:00" | date: "%Y-%m-%dT%H:%M:%S"}}', '1990-12-31T17:00:00', undefined, opts)
    })
    it('should offset date literal with timezone -01:00 specified', function () {
      return test('{{ "1990-12-31T23:00:00-01:00" | date: "%Y-%m-%dT%H:%M:%S"}}', '1990-12-31T18:00:00', undefined, opts)
    })
    it('should offset date from scope (timezone offset)', function () {
      const scope = { date: new Date('1990-12-31T23:00:00Z') }
      return test('{{ date | date: "%Y-%m-%dT%H:%M:%S"}}', scope, '1990-12-31T17:00:00', opts)
    })
    it('should offset date from scope (timezone name)', function () {
      const scope = { date: new Date('1990-12-31T23:00:00Z') }
      return test('{{ date | date: "%Y-%m-%dT%H:%M:%S"}}', scope, '1990-12-31T17:00:00', { timezoneOffset: 'America/Merida' })
    })
    it('should reflect timezoneOffset', function () {
      const scope = { date: new Date('1990-12-31T23:00:00Z') }
      return test('{{ date | date: "%z"}}', scope, '-0600', opts)
    })
    it('opts.timezoneOffset should work with `preserveTimezones`', function () {
      const opts: LiquidOptions = { timezoneOffset: 600, preserveTimezones: true }
      return test('{{ "1990-12-31T23:00:00+02:30" | date: "%Y-%m-%dT%H:%M:%S"}}', '1990-12-31T23:00:00', undefined, opts)
    })
    it('timezoneOffset should work with `preserveTimezones`', async () => {
      const liquid = new Liquid({ preserveTimezones: true })
      const html = liquid.parseAndRenderSync('{{ "1990-12-31T23:00:00Z" | date: "%Y-%m-%dT%H:%M:%S", "Asia/Colombo" }}')
      expect(html).toEqual('1991-01-01T04:30:00')
    })
    it('should use runtime default timezone when not specified', async () => {
      const liquid = new Liquid()
      const html = liquid.parseAndRenderSync('{{ "1990-12-31T23:00:00Z" | date: "%Z" }}')
      expect(html).toEqual(Intl.DateTimeFormat().resolvedOptions().timeZone)
    })
    it('should use in-place timezoneOffset as timezone name', async () => {
      const liquid = new Liquid({ preserveTimezones: true })
      const html = liquid.parseAndRenderSync('{{ "1990-12-31T23:00:00Z" | date: "%Y-%m-%dT%H:%M:%S %Z", "Asia/Colombo" }}')
      expect(html).toEqual('1991-01-01T04:30:00 Asia/Colombo')
    })
    it('should use options.timezoneOffset as default timezone name', function () {
      const opts: LiquidOptions = { timezoneOffset: 'Australia/Brisbane' }
      return test('{{ "1990-12-31T23:00:00.000Z" | date: "%Y-%m-%dT%H:%M:%S %Z"}}', '1991-01-01T10:00:00 Australia/Brisbane', undefined, opts)
    })
    it('should use given timezone offset number as timezone name', function () {
      const opts: LiquidOptions = { preserveTimezones: true }
      return test('{{ "1990-12-31T23:00:00+02:30" | date: "%Y-%m-%dT%H:%M:%S %:Z"}}', '1990-12-31T23:00:00 +02:30', undefined, opts)
    })
  })
  describe('dateFormat', function () {
    const optsWithoutDateFormat: LiquidOptions = { timezoneOffset: 360 } // -06:00
    // date.DEFAULT_FMT: '%A, %B %-e, %Y at %-l:%M %P %z'
    it('should use default format for date filters without format argument', function () {
      return test('{{ "2022-12-08T03:22:18.000Z" | date }}', 'Wednesday, December 7, 2022 at 9:22 pm -0600', undefined, optsWithoutDateFormat)
    })
    it('should use given date filter format argument and NOT default format', function () {
      return test('{{ "1990-12-31T23:00:00Z" | date: "%Y-%m-%dT%H:%M:%S" }}', '1990-12-31T17:00:00', undefined, optsWithoutDateFormat)
    })

    const optsWithDateFormat: LiquidOptions = { timezoneOffset: -330, dateFormat: '%d%q of %b %Y at %I:%M %P' } // -06:00, 31st of Dec 1990 at 11:00 pm
    it('should use configured `options.dateFormat` for date filters without format argument', function () {
      return test('{{ "2022-12-08T13:30:18.000Z" | date }}', '08th of Dec 2022 at 07:00 pm', undefined, optsWithDateFormat)
    })
    it('should use given date filter format argument and NOT `options.dateFormat`', function () {
      return test('{{ "1990-12-31T23:00:00Z" | date: "%Y-%m-%dT%H:%M:%S" }}', '1991-01-01T04:30:00', undefined, optsWithDateFormat)
    })
  })
})
describe('filters/date_to_xmlschema', function () {
  const liquid = new Liquid()
  it('should support literal date', function () {
    const output = liquid.parseAndRenderSync('{{ "1990-10-15T23:00:00" | date_to_xmlschema }}')
    expect(output).toMatch(/^1990-10-15T23:00:00[+-]\d\d:\d\d$/)
  })
  it('should timezoned date', function () {
    const liquid = new Liquid({ preserveTimezones: true })
    const output = liquid.parseAndRenderSync('{{ "2008-11-07T13:07:54-08:00" | date_to_xmlschema }}')
    expect(output).toEqual('2008-11-07T13:07:54-08:00')
  })
})
describe('filters/date_to_rfc822', function () {
  const liquid = new Liquid()
  it('should support literal date', function () {
    const output = liquid.parseAndRenderSync('{{ "1990-10-15T23:00:00" | date_to_rfc822 }}')
    expect(output).toMatch(/^Mon, 15 Oct 1990 23:00:00 [+-]\d{4}$/)
  })
  it('should timezoned date', function () {
    const liquid = new Liquid({ preserveTimezones: true })
    const output = liquid.parseAndRenderSync('{{ "2008-11-07T13:07:54-08:00" | date_to_rfc822 }}')
    expect(output).toEqual('Fri, 07 Nov 2008 13:07:54 -0800')
  })
})
describe('filters/date_to_string', function () {
  const liquid = new Liquid({ preserveTimezones: true })
  it('should default to non-ordinal, UK', function () {
    const output = liquid.parseAndRenderSync('{{ "2008-11-07T13:07:54-08:00" | date_to_string }}')
    expect(output).toEqual('07 Nov 2008')
  })
  it('should support ordinal, US', function () {
    const output = liquid.parseAndRenderSync('{{ "2008-11-07T13:07:54-08:00" | date_to_string: "ordinal", "US" }}')
    expect(output).toEqual('Nov 7th, 2008')
  })
  it('should render none if not valid', function () {
    const output = liquid.parseAndRenderSync('{{ "hello" | date_to_string: "ordinal", "US" }}')
    expect(output).toEqual('hello')
  })
})

describe('filters/date_to_long_string', function () {
  const liquid = new Liquid({ preserveTimezones: true })
  it('should default to non-ordinal, UK', function () {
    const output = liquid.parseAndRenderSync('{{ "2008-11-07T13:07:54-08:00" | date_to_long_string }}')
    expect(output).toEqual('07 November 2008')
  })
  it('should support ordinal, US', function () {
    const output = liquid.parseAndRenderSync('{{ "2008-11-07T13:07:54-08:00" | date_to_long_string: "ordinal", "US" }}')
    expect(output).toEqual('November 7th, 2008')
  })
  it('should support ordinal, UK', function () {
    const output = liquid.parseAndRenderSync('{{ "2008-11-07T13:07:54-08:00" | date_to_long_string: "ordinal" }}')
    expect(output).toEqual('7th November 2008')
  })
})
