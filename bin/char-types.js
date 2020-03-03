#!/usr/bin/env node

function isQuote (c) {
  return c === '"' || c === "'"
}

function isOperator (c) {
  return '!=<>'.includes(c)
}

function isNumber (c) {
  return c >= '0' && c <= '9'
}

function isCharacter (c) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
}

function isVariable (c) {
  return '_-?'.includes(c) || isCharacter(c) || isNumber(c)
}

function isBlank (c) {
  return c === '\n' || c === '\t' || c === ' ' || c === '\r'
}

const types = []
for (let i = 0; i < 128; i++) {
  const c = String.fromCharCode(i)
  let n = 0
  if (isVariable(c)) n |= 1
  if (isOperator(c)) n |= 2
  if (isBlank(c)) n |= 4
  if (isQuote(c)) n |= 8
  types.push(n)
}
console.log(`
const TYPES = '${types.join('')}'
const VARIABLE = 1
const OPERATOR = 2
const BLANK = 4
const QUOTE = 8
`.trim())
