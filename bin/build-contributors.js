const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8').replace(/\r\n/g, '\n')

function extractSection (text, beginMarker, endMarker) {
  const lines = text.split('\n')
  let inside = false
  const result = []
  for (const line of lines) {
    if (line.includes(endMarker)) inside = false
    if (inside) result.push(line)
    if (line.includes(beginMarker)) inside = true
  }
  return result.join('\n')
}

function transformContributors (html) {
  return html
    .replace(/<br \/>.*?<\/td>/g, '</a></td>')
    .replace(/width="[^"]*"/g, '')
    .replace(/\n/g, '')
    .replace(/<\/tr>\s*<tr>/g, '')
}

function transformFinancial (html) {
  return html
    .replace(/<br \/>.*?<\/td>/g, '</a></td>')
    .replace(/\n/g, '')
    .replace(/<\/tr>\s*<tr>/g, '')
}

const allContributors = transformContributors(extractSection(readme, 'ALL-CONTRIBUTORS-LIST:START', 'ALL-CONTRIBUTORS-LIST:END'))
const financialContributors = transformFinancial(extractSection(readme, 'FINANCIAL-CONTRIBUTORS-BEGIN', 'FINANCIAL-CONTRIBUTORS-END'))

const outDir = path.join(root, 'docs/themes/navy/layout/partial')
fs.writeFileSync(path.join(outDir, 'all-contributors.swig'), allContributors)
fs.writeFileSync(path.join(outDir, 'financial-contributors.swig'), financialContributors)
