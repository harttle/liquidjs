/**
 * The date interface LiquidJS uses.
 * Basically a subset of JavaScript Date,
 * it's defined abstractly here to allow different implementation
 */
export interface LiquidDate {
  getTime(): number;
  getMilliseconds(): number;
  getSeconds(): number;
  getMinutes(): number;
  getHours(): number;
  getDay(): number;
  getDate(): number;
  getMonth(): number;
  getFullYear(): number;
  getTimezoneOffset(): number;
  toLocaleTimeString(): string;
  toLocaleDateString(): string;
}
