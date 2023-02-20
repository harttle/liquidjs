import { LiquidOptions } from '../../../src/liquid-options'
import { test } from '../../stub/render'

describe('filters/date', function () {
  it('should support date: %a %b %d %Y', function () {
    const date = new Date()
    return test('{{ date | date:"%a %b %d %Y"}}', { date }, date.toDateString())
  })
  it('should support "now"', function () {
    // sample: Thursday, February 2, 2023 at 6:25 pm +0000
    return test('{{ "now" | date }}', /\w+, \w+ \d+, \d\d\d\d at \d+:\d\d [ap]m [-+]\d\d\d\d/)
  })
  it('should create a new Date when given "now"', function () {
    return test('{{ "now" | date: "%Y"}}', (new Date()).getFullYear().toString())
  })
  it('should create a new Date when given "today"', function () {
    return test('{{ "today" | date: "%Y"}}', (new Date()).getFullYear().toString())
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
    it('should work with `preserveTimezones`', function () {
      const opts: LiquidOptions = { timezoneOffset: 600, preserveTimezones: true }
      return test('{{ "1990-12-31T23:00:00+02:30" | date: "%Y-%m-%dT%H:%M:%S"}}', '1990-12-31T23:00:00', undefined, opts)
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
