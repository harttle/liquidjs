import { Token } from '../tokens/token'
import { isTagToken, isHTMLToken, isDelimitedToken } from '../util/type-guards'
import { NormalizedFullOptions } from '../liquid-options'
import { TYPES, INLINE_BLANK, BLANK } from '../util/character'

export function whiteSpaceCtrl (tokens: Token[], options: NormalizedFullOptions) {
  let inRaw = false

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (!isDelimitedToken(token)) continue
    if (!inRaw && token.trimLeft) {
      trimLeft(tokens[i - 1], options.greedy)
    }

    if (isTagToken(token)) {
      if (token.name === 'raw') inRaw = true
      else if (token.name === 'endraw') inRaw = false
    }

    if (!inRaw && token.trimRight) {
      trimRight(tokens[i + 1], options.greedy)
    }
  }
}

function trimLeft (token: Token, greedy: boolean) {
  if (!token || !isHTMLToken(token)) return

  const mask = greedy ? BLANK : INLINE_BLANK
  while (TYPES[token.input.charCodeAt(token.end - 1 - token.trimRight)] & mask) token.trimRight++
}

function trimRight (token: Token, greedy: boolean) {
  if (!token || !isHTMLToken(token)) return

  const mask = greedy ? BLANK : INLINE_BLANK
  while (TYPES[token.input.charCodeAt(token.begin + token.trimLeft)] & mask) token.trimLeft++
  if (token.input.charAt(token.begin + token.trimLeft) === '\n') token.trimLeft++
}
