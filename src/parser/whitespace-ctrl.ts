import Token from '../parser/token'
import TagToken from '../parser/tag-token'
import HTMLToken from '../parser/html-token'
import { NormalizedFullOptions } from '../liquid-options'

export default function whiteSpaceCtrl (tokens: Token[], options: NormalizedFullOptions) {
  options = { greedy: true, ...options }
  let inRaw = false

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (!inRaw && token.trimLeft) {
      trimLeft(tokens[i - 1], options.greedy)
    }

    if (TagToken.is(token)) {
      if (token.name === 'raw') inRaw = true
      else if (token.name === 'endraw') inRaw = false
    }

    if (!inRaw && token.trimRight) {
      trimRight(tokens[i + 1], options.greedy)
    }
  }
}

function trimLeft (token: Token, greedy: boolean) {
  if (!token || !HTMLToken.is(token)) return

  const rLeft = greedy ? /\s+$/g : /[\t\r ]*$/g
  token.value = token.value.replace(rLeft, '')
}

function trimRight (token: Token, greedy: boolean) {
  if (!token || !HTMLToken.is(token)) return

  const rRight = greedy ? /^\s+/g : /^[\t\r ]*\n?/g
  token.value = token.value.replace(rRight, '')
}
