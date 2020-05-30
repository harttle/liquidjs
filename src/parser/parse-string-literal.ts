const rHex = /[\da-fA-F]/
const rOct = /[0-7]/
const escapeChar = {
  b: '\b',
  f: '\f',
  n: '\n',
  r: '\r',
  t: '\t',
  v: '\x0B'
}

function hexVal (c: string) {
  const code = c.charCodeAt(0)
  if (code >= 97) return code - 87
  if (code >= 65) return code - 55
  return code - 48
}

export function parseStringLiteral (str: string): string {
  let ret = ''
  for (let i = 1; i < str.length - 1; i++) {
    if (str[i] !== '\\') {
      ret += str[i]
      continue
    }
    if (escapeChar[str[i + 1]] !== undefined) {
      ret += escapeChar[str[++i]]
    } else if (str[i + 1] === 'u') {
      let val = 0
      let j = i + 2
      while (j <= i + 5 && rHex.test(str[j])) {
        val = val * 16 + hexVal(str[j++])
      }
      i = j - 1
      ret += String.fromCharCode(val)
    } else if (!rOct.test(str[i + 1])) {
      ret += str[++i]
    } else {
      let j = i + 1
      let val = 0
      while (j <= i + 3 && rOct.test(str[j])) {
        val = val * 8 + hexVal(str[j++])
      }
      i = j - 1
      ret += String.fromCharCode(val)
    }
  }
  return ret
}
