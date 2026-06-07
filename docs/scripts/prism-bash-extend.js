'use strict'

/**
 * Extend Prism's bash grammar with extra CLI commands for docs code blocks.
 * Hexo loads scripts from docs/scripts/ during init, before `hexo generate`
 * highlights fenced code via syntax_highlighter: prismjs.
 *
 * To highlight another command, add its name to EXTRA_BASH_COMMANDS below.
 */
const EXTRA_BASH_COMMANDS = [
  'npx'
]

const Prism = require('prismjs')
require('prismjs/components/prism-bash')

function extendBashCommandHighlighting (commands) {
  const bash = Prism.languages.bash
  if (!bash || !bash.function) return

  const fnToken = bash.function
  const pattern = fnToken.pattern
  if (!(pattern instanceof RegExp)) return

  const source = pattern.source
  const listMatch = source.match(/\(\?:([^)]+)\)(?=\(\?\=)/)
  if (!listMatch) return

  const existing = listMatch[1]
  const toAdd = commands.filter((cmd) => {
    const re = new RegExp(`(?:^|\\|)${cmd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\||$)`)
    return !re.test(existing)
  })
  if (toAdd.length === 0) return

  const extended = `${existing}|${toAdd.join('|')}`
  fnToken.pattern = new RegExp(
    source.replace(/\(\?:([^)]+)\)(?=\(\?\=)/, `(?:${extended})`),
    pattern.flags
  )
}

extendBashCommandHighlighting(EXTRA_BASH_COMMANDS)
