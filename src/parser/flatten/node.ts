/**
 * This function forces a string to be re-instantiated in memory using a flat representation instead of a graph
 * of concatenated strings. This is an optimization to reduce the memory footprint of token string fragments after
 * they are parsed.
 * This optimization targets the V8 javascript engine and only works on Node.js.
 * @param {string} str
 */
export function flatten (str: string) {
  return Buffer.from(str).toString()
}
