'use strict'

/**
 * Extend Prism's bash grammar with extra CLI commands for docs code blocks.
 * Hexo loads scripts from docs/scripts/ during init, before `hexo generate`
 * highlights fenced code via syntax_highlighter: prismjs.
 *
 * Bash highlights known commands via a large hard-coded regex (see prism-bash).
 * insertBefore is the supported extension point when a command is not in that list.
 * Add names to EXTRA_BASH_COMMANDS as needed.
 *
 * After editing this file, run `npx hexo clean` before generate/serve so
 * Hexo re-highlights cached pages (db.json does not invalidate on script changes).
 */
const EXTRA_BASH_COMMANDS = [
  'npx'
]

const Prism = require('prismjs')
require('prismjs/components/prism-bash')

const escaped = EXTRA_BASH_COMMANDS.map((cmd) =>
  cmd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
)

Prism.languages.insertBefore('bash', 'function', {
  'cli-command': {
    pattern: new RegExp(
      `(^|[\\s;|&]|[<>]\\()(?:${escaped.join('|')})(?=$|[)\\s;|&])`
    ),
    lookbehind: true,
    alias: ['builtin', 'class-name']
  }
})
