import { LiquidDate } from '../../src/util'

const locale = Intl.DateTimeFormat().resolvedOptions().locale

export class DateWithTimezone extends LiquidDate {
  constructor (init: string, timezone: number) {
    super(init, locale)
    this.getTimezoneOffset = () => timezone
  }
}

export class TestDate extends LiquidDate {
  constructor (v: any) {
    super(v, locale)
  }
}
