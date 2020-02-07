const rBlank = /\s/
const rPunctuation = /[<>=!]/

enum ParseState {
  INIT = 1,
  SINGLE_QUOTE = 2,
  DOUBLE_QUOTE = 4,
  QUOTE = 6,
  BRACKET = 8
}

export function * tokenize (expr: string): IterableIterator<string> {
  const N = expr.length
  const stack = [ParseState.INIT]
  let str = ''
  let lastIsPunc = false

  for (let i = 0; i < N; i++) {
    const c = expr[i]
    const top = stack[stack.length - 1]
    const isPunc = rPunctuation.test(c)
    if (c === '\\') {
      str += expr.substr(i++, 2)
    } else if (top === ParseState.SINGLE_QUOTE && c === "'") {
      str += c
      stack.pop()
    } else if (top === ParseState.DOUBLE_QUOTE && c === '"') {
      str += c
      stack.pop()
    } else if (ParseState.QUOTE & top) {
      str += c
    } else if (top === ParseState.BRACKET && c === ']') {
      str += c
      stack.pop()
    } else if (top === ParseState.INIT && rBlank.exec(c)) {
      if (str) yield str
      str = ''
    } else if (top === ParseState.INIT && isPunc !== lastIsPunc) {
      if (str) yield str
      str = c
    } else {
      if (c === '"') stack.push(ParseState.DOUBLE_QUOTE)
      else if (c === "'") stack.push(ParseState.SINGLE_QUOTE)
      else if (c === '[') stack.push(ParseState.BRACKET)
      str += c
    }
    lastIsPunc = isPunc
  }
  if (str) yield str
}
