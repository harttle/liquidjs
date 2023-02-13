#!/usr/bin/env node

const fs = require('fs/promises')
const Liquid = require('..').Liquid

// Preserve compatibility by falling back to legacy CLI behavior if:
// - stdin is redirected (i.e. not connected to a terminal)
// - there are either no arguments, or only a single argument which does not start with a dash
// TODO: Remove this fallback for 11.0

if (!process.stdin.isTTY) {
  if (process.argv.length === 2 || (process.argv.length === 3 && !process.argv[2].startsWith('-'))) {
    renderLegacy()
    return
  }
}

render()

async function render () {
  const { program } = require('commander')

  program
    .name('liquidjs')
    .description('Render a Liquid template')
    .requiredOption('-t, --template <path | liquid>', 'liquid template to render (as path or inline)') // TODO: Change to argument in 11.0
    .option('-c, --context <path | json>', 'input context in JSON format (as path or inline; omit to read from stdin)')
    .option('-o, --output <path>', 'write rendered output to file (omit to write to stdout)')
    .option('--cache [size]', 'cache previously parsed template structures (default cache size: 1024)')
    .option('--extname <string>', 'use a default filename extension when resolving partials and layouts')
    .option('--jekyll-include', 'use jekyll-style include (pass parameters to include variable of current scope)')
    .option('--js-truthy', 'use JavaScript-style truthiness')
    .option('--layouts <path...>', 'directories from where to resolve layouts (defaults to --root)')
    .option('--lenient-if', 'do not throw on undefined variables in conditional expressions (when using --strict-variables)')
    .option('--no-dynamic-partials', 'always treat file paths for partials and layouts as a literal value')
    .option('--no-greedy', 'disable greedy matching for --trim* options')
    .option('--no-relative-reference', 'require absolute file paths for partials and layouts')
    .option('--ordered-filter-parameters', 'respect parameter order when using filters')
    .option('--output-delimiter-left <string>', 'left delimiter to use for liquid outputs')
    .option('--output-delimiter-right <string>', 'right delimiter to use for liquid outputs')
    .option('--partials <path...>', 'directories from where to resolve partials (defaults to --root)')
    .option('--preserve-timezones', 'preserve input timezone in date filter')
    .option('--root <path...>', 'directories from where to resolve partials and layouts (defaults to ".")')
    .option('--strict-filters', 'throw on undefined filters instead of skipping them')
    .option('--strict-variables', 'throw on undefined variables instead of rendering them as empty string')
    .option('--tag-delimiter-left', 'left delimiter to use for liquid tags')
    .option('--tag-delimiter-right', 'right delimiter to use for liquid tags')
    .option('--timezone-offset <value>', 'JavaScript timezone name or timezoneOffset value to use in date filter (defaults to local timezone)')
    .option('--trim-output-left', 'trim whitespace from left of liquid outputs')
    .option('--trim-output-right', 'trim whitespace from right of liquid outputs')
    .option('--trim-tag-left', 'trim whitespace from left of liquid tags')
    .option('--trim-tag-right', 'trim whitespace from right of liquid tags')
    .showHelpAfterError('Use -h or --help for additional information.')
    .parse()

  const options = program.opts()
  const template = await resolvePathOption(options.template)
  const context = await resolveContext(options.context)

  const liquid = new Liquid(options)
  const output = liquid.parseAndRenderSync(template, context)
  if (options.output) {
    await fs.writeFile(options.output, output)
  } else {
    process.stdout.write(output)
    process.stdout.write('\n')
  }
}

async function resolveContext (contextOption) {
  let contextJson = '{}'
  if (contextOption) {
    contextJson = await resolvePathOption(contextOption)
  } else if (!process.stdin.isTTY) { // Read context from stdin if not connected to a terminal
    contextJson = await readStream(process.stdin)
  }
  const context = JSON.parse(contextJson)
  return context
}

async function resolvePathOption (option) {
  let content = null
  if (option) {
    const stat = await fs.stat(option, { throwIfNoEntry: false })
    if (stat && stat.isFile) {
      content = await fs.readFile(option, 'utf8')
    } else {
      content = option
    }
  }
  return content
}

// TODO: Remove for 11.0
async function renderLegacy () {
  process.stderr.write('Reading template from stdin. This mode will be removed in next major version, use --template option instead.\n')
  const contextArg = process.argv.slice(2)[0]
  let context = {}
  if (contextArg) {
    const contextJson = await resolvePathOption(contextArg)
    context = JSON.parse(contextJson)
  }
  const template = await readStream(process.stdin)
  const liquid = new Liquid()
  const output = liquid.parseAndRenderSync(template, context)
  process.stdout.write(output)
}

async function readStream (stream) {
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}
