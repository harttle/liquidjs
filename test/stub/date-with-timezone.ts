export class DateWithTimezone extends Date {
  constructor (init: string, timezone: number) {
    super(init)
    this.getTimezoneOffset = () => timezone
  }
}
