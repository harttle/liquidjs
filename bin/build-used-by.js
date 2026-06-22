const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const readmePath = path.join(root, 'README.md')
const dataPath = path.join(root, 'data/used-by.json')
const outDir = path.join(root, 'docs/themes/navy/layout/partial')

const LINK_STYLE = 'display: inline-block; vertical-align: middle; margin: 8px;'
const IMG_STYLE = 'vertical-align: middle;'
const PER_ROW = 7

function escapeHtml (str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function websiteFavicon (url) {
  return 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=' +
    encodeURIComponent(url) +
    '&size=128'
}

async function githubAvatar (url) {
  try {
    const { hostname, pathname } = new URL(url)
    if (hostname !== 'github.com') return
    const owner = pathname.split('/').filter(Boolean)[0]
    if (!owner) return
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(owner)}`, {
      headers: { 'User-Agent': 'liquidjs-build-used-by' }
    })
    if (!res.ok) return
    const data = await res.json()
    if (!data.avatar_url) return
    const base = data.avatar_url.split('?')[0]
    return `${base}?s=128`
  } catch {}
}

async function resolveLogo (entry) {
  if (entry.logo) return entry.logo
  const gh = await githubAvatar(entry.url)
  if (gh) return gh
  return websiteFavicon(entry.url)
}

function imgTag ({ name, src, width, height, imgStyle }) {
  const alt = escapeHtml(name)
  const href = escapeHtml(src)
  const dims = []
  if (width) dims.push(`width="${width}"`)
  if (height) dims.push(`height="${height}"`)
  else if (!width) dims.push('height="80"')
  const style = imgStyle ? `${IMG_STYLE}${imgStyle}` : IMG_STYLE
  return `<img src="${href}" ${dims.join(' ')} style="${style}" alt="${alt}" title="${alt}"/>`
}

function linkTag (entry, logo) {
  const href = escapeHtml(entry.url)
  const img = imgTag({
    name: entry.name,
    src: logo,
    width: entry.width,
    height: entry.height,
    imgStyle: entry.imgStyle
  })
  return `  <a href="${href}" style="${LINK_STYLE}">${img}</a>`
}

async function renderHtml (entries) {
  const logos = await Promise.all(entries.map(resolveLogo))
  const links = entries.map((entry, i) => linkTag(entry, logos[i]))
  const lines = ['<p align="center" style="line-height: 2.5;">']
  links.forEach((link, i) => {
    if (i > 0 && i % PER_ROW === 0 && links.length - i > 2) lines.push('  <br/>')
    lines.push(link)
  })
  lines.push('</p>')
  return lines.join('\n')
}

function transformUsedBy (html) {
  return html
    .replace(/<br \/>.*?<\/td>/g, '</a></td>')
    .replace(/\n/g, '')
    .replace(/<\/tr>\s*<tr>/g, '')
}

function patchReadme (html) {
  const readme = fs.readFileSync(readmePath, 'utf8').replace(/\r\n/g, '\n')
  const begin = '<!-- USED-BY-BEGIN -->'
  const end = '<!-- USED-BY-END -->'
  const re = new RegExp(`${begin}[\\s\\S]*?${end}`)
  if (!re.test(readme)) {
    throw new Error(`README.md is missing ${begin} … ${end}`)
  }
  const next = readme.replace(re, `${begin}\n${html}\n${end}`)
  fs.writeFileSync(readmePath, next)
}

const entries = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

async function main () {
  const html = await renderHtml(entries)
  patchReadme(html)
  fs.writeFileSync(path.join(outDir, 'used-by.swig'), transformUsedBy(html))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
