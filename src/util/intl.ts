export function getDateTimeFormat () {
  return (typeof Intl !== 'undefined' ? Intl.DateTimeFormat : undefined)
}
