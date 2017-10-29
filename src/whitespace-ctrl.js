const _ = require('./util/underscore.js')

function whiteSpaceCtrl (tokens, options) {
  options = _.assign({ greedy: true }, options)
  var inRaw = false

  tokens.forEach((token, i) => {
    if (!inRaw && (token.trim_left || options.trim_left)) {
      trimLeft(tokens[i - 1], options.greedy)
    }

    if (token.type === 'tag' && token.name === 'raw') inRaw = true
    if (token.type === 'tag' && token.name === 'endraw') inRaw = false

    if (!inRaw && (token.trim_right || options.trim_right)) {
      trimRight(tokens[i + 1], options.greedy)
    }
  })
}

function trimLeft (token, greedy) {
  if (!token || token.type !== 'html') return

  var rLeft = greedy ? /\s+$/g : /[\t\r ]*$/g
  token.value = token.value.replace(rLeft, '')
}

function trimRight (token, greedy) {
  if (!token || token.type !== 'html') return

  var rRight = greedy ? /^\s+/g : /^[\t\r ]*\n?/g
  token.value = token.value.replace(rRight, '')
}

module.exports = whiteSpaceCtrl
