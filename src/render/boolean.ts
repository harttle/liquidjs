export function isTruthy (val: any): boolean {
  return !isFalsy(val)
}
export function isFalsy (val: any): boolean {
  return val === false || undefined === val || val === null
}
