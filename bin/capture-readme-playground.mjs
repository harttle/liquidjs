/* global liquidjs */
import { spawn, execFile } from 'node:child_process'
import { access, copyFile, mkdir, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { chromium } from 'playwright'

const execFileAsync = promisify(execFile)
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = join(root, 'docs')
const framesDir = join(root, '.local/playground-gif-frames')
const outPath = join(docsDir, 'source/playground-demo.gif')
const url = 'http://127.0.0.1:4001/playground.html'

const CAPTURE_WIDTH = 980
const VIEWPORT_WIDTH = 1100
const VIEWPORT_HEIGHT = 1000
const DEVICE_SCALE = 2
const FPS = 12
const LAST_FRAME_HOLD = 2.5
const CHAR_MS = 55

const LINE_HEIGHT = 21
const WINDOW_CHROME = 36
const GRID_GAP = 16
const EDITOR_PAD = 16

function run (cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts })
    child.on('error', reject)
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))))
  })
}

async function waitForServer (maxMs = 120000) {
  const start = Date.now()
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch(url)
      if (res.ok) return
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(`Timed out waiting for ${url}`)
}

async function ensureDocsDeps () {
  try {
    await access(join(docsDir, 'node_modules/hexo/package.json'))
  } catch {
    await run('npm', ['ci'], { cwd: docsDir })
  }
}

async function prepareCapture (page, { fullTemplate, fullContext }) {
  await page.addStyleTag({
    content: `
      #editors .capture-pane {
        margin: 0;
        box-sizing: border-box;
        font: 14px/1.5 "Source Code Pro", ui-monospace, Monaco, Menlo, Consolas, monospace;
        white-space: pre;
        overflow: hidden;
        color: #24292f;
        background: #fff;
      }
      #editors .capture-cursor {
        color: #24292f;
      }
      #editors .capture-json .json-key { color: #953800; }
      #editors .capture-json .json-string { color: #cf222e; }
    `
  })

  await page.evaluate((opts) => {
    const {
      captureWidth,
      fullTemplate,
      fullContext,
      lineHeight,
      windowChrome,
      gridGap,
      editorPad
    } = opts

    function paneHeight (lines) {
      return windowChrome + editorPad * 2 + lines * lineHeight + 4
    }

    function escapeHtml (str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    }

    function highlightJson (text) {
      return escapeHtml(text)
        .replace(/"([^"]+)":/g, '<span class="json-key">"$1":</span>')
        .replace(/: "([^"]*)"/g, ': <span class="json-string">"$1"</span>')
    }

    function mountPane (shell, className, html) {
      shell.innerHTML = ''
      shell.style.paddingTop = '0'
      shell.style.overflow = 'hidden'
      const pre = document.createElement('pre')
      pre.className = 'capture-pane ' + className
      pre.style.height = '100%'
      pre.style.padding = `${editorPad}px`
      if (html) pre.innerHTML = html
      shell.appendChild(pre)
      return pre
    }

    document.querySelector('#playground .version')?.remove()
    document.querySelector('#playground h1')?.remove()
    document.querySelector('.loader')?.remove()
    document.querySelector('#playground > .wrapper')?.style.setProperty('margin-bottom', '0')
    document.body.style.background = '#fff'
    document.querySelector('#playground').style.background = '#fff'

    window.__captureEngine = new liquidjs.Liquid({ memoryLimit: 1e5, renderLimit: 1e5 })
    window.__captureContext = JSON.parse(fullContext)
    window.__captureLastHtml = ''

    const templateLineCount = fullTemplate.split('\n').length
    const contextLineCount = fullContext.split('\n').length

    const templateEditorH = paneHeight(templateLineCount)
    const contextEditorH = paneHeight(contextLineCount)

    const leftRow1 = templateEditorH
    const leftRow2 = contextEditorH
    const rightCol = leftRow1 + gridGap + leftRow2
    const gridH = rightCol

    const editors = document.querySelector('#editors')
    editors.classList.remove('inner')
    editors.style.margin = '0 auto'
    editors.style.width = captureWidth + 'px'
    editors.style.maxWidth = captureWidth + 'px'
    editors.style.height = gridH + 'px'
    editors.style.minHeight = gridH + 'px'
    editors.style.overflow = 'visible'
    editors.style.display = 'grid'
    editors.style.gridTemplateColumns = '1fr 1fr'
    editors.style.gridTemplateRows = `${leftRow1}px ${leftRow2}px`
    editors.style.gridGap = gridGap + 'px'
    editors.style.alignItems = 'start'

    document.querySelectorAll('.editor-wrapper').forEach((wrapper) => {
      wrapper.style.overflow = 'visible'
      wrapper.style.minHeight = '0'
    })

    document.querySelector('.area-output').style.gridRow = '1 / -1'
    document.querySelector('.area-output').style.gridColumn = '2'

    const tplShell = document.querySelector('#editorEl')
    const ctxShell = document.querySelector('#dataEl')
    const tplPane = tplShell.closest('.pane-window')
    const ctxPane = ctxShell.closest('.pane-window')
    tplShell.closest('.editor-wrapper').style.height = templateEditorH + 'px'
    ctxShell.closest('.editor-wrapper').style.height = contextEditorH + 'px'
    tplPane.style.height = templateEditorH + 'px'
    ctxPane.style.height = contextEditorH + 'px'
    tplShell.style.height = (templateEditorH - windowChrome) + 'px'
    ctxShell.style.height = (contextEditorH - windowChrome) + 'px'

    window.__captureTpl = mountPane(tplShell, 'capture-liquid', '')
    window.__captureCtx = mountPane(ctxShell, 'capture-json', highlightJson(fullContext))

    const code = document.querySelector('#previewCode')
    code.textContent = ''
    if (window.Prism) {
      delete code.dataset.highlighted
      window.Prism.highlightElement(code)
    }

    const outputPane = document.querySelector('.area-output .pane-window')
    const outputShell = document.querySelector('.output-preview')
    const outputWrap = document.querySelector('.area-output')
    outputWrap.style.height = rightCol + 'px'
    outputPane.style.height = rightCol + 'px'
    outputShell.style.height = (rightCol - windowChrome) + 'px'
    outputShell.style.flex = 'none'
    outputShell.style.overflow = 'hidden'
    outputShell.style.paddingTop = '0'
    const pre = outputShell.querySelector('pre.highlight')
    pre.style.minHeight = '0'
    pre.style.height = '100%'
    pre.style.padding = editorPad + 'px'
    pre.style.margin = '0'
    pre.style.boxSizing = 'border-box'
    pre.style.border = 'none'
    pre.style.boxShadow = 'none'
  }, {
    captureWidth: CAPTURE_WIDTH,
    fullTemplate,
    fullContext,
    lineHeight: LINE_HEIGHT,
    windowChrome: WINDOW_CHROME,
    gridGap: GRID_GAP,
    editorPad: EDITOR_PAD
  })

  await page.waitForTimeout(200)
}

async function setCaptureFrame (page, templateText) {
  await page.evaluate(async (tpl) => {
    function escapeHtml (str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    }

    window.__captureTpl.innerHTML =
      escapeHtml(tpl) + '<span class="capture-cursor">▎</span>'

    let html = window.__captureLastHtml || ''
    try {
      html = await window.__captureEngine.parseAndRender(tpl, window.__captureContext)
      window.__captureLastHtml = html
    } catch {}

    const code = document.querySelector('#previewCode')
    code.textContent = html
    if (window.Prism) {
      delete code.dataset.highlighted
      window.Prism.highlightElement(code)
    }
  }, templateText)
}

async function screenshotEditors (page, file) {
  await page.locator('#editors').screenshot({
    path: file,
    animations: 'disabled',
    type: 'png',
    scale: 'device'
  })
}

async function encodeGif () {
  await execFileAsync('ffmpeg', [
    '-y',
    '-framerate', String(FPS),
    '-i', join(framesDir, 'frame-%03d.png'),
    '-vf', `tpad=stop_mode=clone:stop_duration=${LAST_FRAME_HOLD},split[s0][s1];[s0]palettegen=max_colors=256:stats_mode=full[p];[s1][p]paletteuse=dither=floyd_steinberg`,
    '-loop', '0',
    outPath
  ], { stdio: 'inherit' })
}

async function main () {
  await run('npm', ['run', 'build:docs-liquid'], { cwd: root })
  await run('npm', ['run', 'build:contributors'], { cwd: root })
  await run('npm', ['run', 'build:used-by'], { cwd: root })
  await ensureDocsDeps()
  await rm(framesDir, { recursive: true, force: true })
  await mkdir(framesDir, { recursive: true })

  const server = spawn('npx', ['hexo', 'server', '-p', '4001'], {
    cwd: docsDir,
    shell: true,
    stdio: 'ignore'
  })

  try {
    await waitForServer()

    const browser = await chromium.launch()
    const page = await browser.newPage({
      viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
      deviceScaleFactor: DEVICE_SCALE
    })
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto(url, { waitUntil: 'networkidle' })

    const allowCookies = page.getByRole('button', { name: 'Allow all cookies' })
    if (await allowCookies.count()) {
      await allowCookies.click()
    }

    await page.waitForSelector('#editors:not(.hide)', { timeout: 60000 })
    await page.waitForFunction(() => {
      return window.ace?.edit?.('editorEl')?.getValue().includes('name | capitalize')
    })

    const fullTemplate = await page.evaluate(() => window.ace.edit('editorEl').getValue())
    const fullContext = await page.evaluate(() => window.ace.edit('dataEl').getValue())

    await prepareCapture(page, { fullTemplate, fullContext })

    const framePaths = []
    let frameIndex = 0

    for (let i = 0; i <= fullTemplate.length; i++) {
      const partial = fullTemplate.slice(0, i)
      await setCaptureFrame(page, partial)
      await page.waitForTimeout(CHAR_MS)
      const file = join(framesDir, `frame-${String(frameIndex).padStart(3, '0')}.png`)
      framePaths.push(file)
      await screenshotEditors(page, file)
      frameIndex++
    }

    await encodeGif()
    await mkdir(join(root, '.local'), { recursive: true })
    await copyFile(framePaths[framePaths.length - 1], join(root, '.local/playground-gif-last-frame.png'))
    await browser.close()
    console.log(`Wrote ${outPath} (${framePaths.length} frames @ ${FPS} fps, char typing + live output)`)
  } finally {
    server.kill()
    await rm(framesDir, { recursive: true, force: true })
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
