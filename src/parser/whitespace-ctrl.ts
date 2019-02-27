import DelimitedToken from '../parser/delimited-token'
import Token from '../parser/token'
import TagToken from '../parser/tag-token'
import { NormalizedFullOptions } from '../liquid-options'

export default function whiteSpaceCtrl (tokens: Token[], options: NormalizedFullOptions) {
  options = { greedy: true, ...options }
  let inRaw = false

  tokens.forEach((token: Token, i: number) => {
    if (shouldTrimLeft(token as DelimitedToken, inRaw, options)) {
      trimLeft(tokens[i - 1], options.greedy)
    }

    if (token.type === 'tag' && (token as TagToken).name === 'raw') inRaw = true
    if (token.type === 'tag' && (token as TagToken).name === 'endraw') inRaw = false

    if (shouldTrimRight(token as DelimitedToken, inRaw, options)) {
      trimRight(tokens[i + 1], options.greedy)
    }
  })
}

function shouldTrimLeft (token: DelimitedToken, inRaw: boolean, options: NormalizedFullOptions) {
  if (inRaw) return false
  if (token.type === 'tag') return token.trimLeft || options.trimTagLeft
  if (token.type === 'output') return token.trimLeft || options.trimOutputLeft
}

function shouldTrimRight (token: DelimitedToken, inRaw: boolean, options: NormalizedFullOptions) {
  if (inRaw) return false
  if (token.type === 'tag') return token.trimRight || options.trimTagRight
  if (token.type === 'output') return token.trimRight || options.trimOutputRight
}

function trimLeft (token: Token, greedy: boolean) {
  if (!token || token.type !== 'html') return

  const rLeft = greedy ? /\s+$/g : /[\t\r ]*$/g
  token.value = token.value.replace(rLeft, '')
}

function trimRight (token: Token, greedy: boolean) {
  if (!token || token.type !== 'html') return

  const rRight = greedy ? /^\s+/g : /^[\t\r ]*\n?/g
  token.value = token.value.replace(rRight, '')
}
