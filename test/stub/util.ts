export function throwIntendedError () {
  throw new Error('intended error')
}
export async function rejectIntendedError () {
  throw new Error('intended reject')
}
