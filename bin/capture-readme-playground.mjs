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

const LINE_HEIGHT = 22
const PANE_HEAD = 36
const GRID_GAP = 12
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
      #playground .capture-pane {
        margin: 0;
        box-sizing: border-box;
        font: 14px/1.55 "Source Code Pro", ui-monospace, Monaco, Menlo, Consolas, monospace;
        white-space: pre-wrap;
        overflow: hidden;
        color: #24292f;
        background: transparent;
      }
      #playground .capture-cursor {
        color: #24292f;
      }
      #playground .capture-json .json-key { color: #953800; }
      #playground .capture-json .json-string { color: #cf222e; }
      #playground .pane-indicator {
        animation: none;
        transform: none;
        box-shadow: none;
        opacity: 1;
      }
    `
  })

  await page.evaluate((opts) => {
    const {
      captureWidth,
      fullTemplate,
      fullContext,
      lineHeight,
      paneHead,
      gridGap,
      editorPad
    } = opts

    function paneHeight (lines) {
      return paneHead + editorPad * 2 + lines * lineHeight + 4
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

    function mountPane (editorEl, className, html) {
      const paneBody = editorEl.closest('.pane-body')
      editorEl.remove()
      const pre = document.createElement('pre')
      pre.className = 'capture-pane ' + className
      pre.style.flex = '1 1 auto'
      pre.style.minHeight = '0'
      pre.style.margin = '0'
      if (html) pre.innerHTML = html
      paneBody.appendChild(pre)
      return pre
    }

    function setIndicator (area, state) {
      const el = document.querySelector(area + ' .pane-indicator')
      if (el) el.dataset.state = state
    }

    document.querySelector('#playground .playground-hero')?.remove()
    document.querySelector('.loader')?.remove()
    document.querySelector('#playground > .wrapper')?.style.setProperty('margin-bottom', '0')
    document.body.style.background = '#fff'
    document.querySelector('#playground').style.background = '#fff'
    document.documentElement.style.colorScheme = 'light'

    window.__captureEngine = new liquidjs.Liquid({ memoryLimit: 1e5, renderLimit: 1e5 })
    window.__captureContext = JSON.parse(fullContext)
    window.__captureLastHtml = ''
    window.__captureSetIndicators = setIndicator

    const templateLineCount = fullTemplate.split('\n').length
    const contextLineCount = fullContext.split('\n').length
    const templateEditorH = paneHeight(templateLineCount)
    const contextEditorH = paneHeight(contextLineCount)
    const rightCol = templateEditorH + gridGap + contextEditorH

    const editors = document.querySelector('#editors')
    editors.classList.remove('inner', 'hide')
    editors.style.margin = '0 auto'
    editors.style.width = captureWidth + 'px'
    editors.style.maxWidth = captureWidth + 'px'

    const workspace = document.querySelector('.playground-workspace')
    workspace.style.height = rightCol + 'px'
    workspace.style.minHeight = rightCol + 'px'
    workspace.style.maxHeight = rightCol + 'px'
    workspace.style.overflow = 'visible'
    workspace.style.gridTemplateRows = `${templateEditorH}px ${contextEditorH}px`

    document.querySelector('.area-tpl').style.height = templateEditorH + 'px'
    document.querySelector('.area-data').style.height = contextEditorH + 'px'
    document.querySelector('.area-output').style.height = rightCol + 'px'

    window.__captureTpl = mountPane(document.querySelector('#editorEl'), 'capture-liquid', '')
    window.__captureCtx = mountPane(document.querySelector('#dataEl'), 'capture-json', highlightJson(fullContext))
    window.__captureOut = mountPane(document.querySelector('#previewEl'), 'capture-output', '')

    setIndicator('.area-tpl', 'idle')
    setIndicator('.area-data', 'idle')
    setIndicator('.area-output', 'idle')
  }, {
    captureWidth: CAPTURE_WIDTH,
    fullTemplate,
    fullContext,
    lineHeight: LINE_HEIGHT,
    paneHead: PANE_HEAD,
    gridGap: GRID_GAP,
    editorPad: EDITOR_PAD
  })

  await page.waitForTimeout(200)
}

async function setCaptureFrame (page, templateText, { settled = false } = {}) {
  await page.evaluate(async ({ tpl, settled }) => {
    function escapeHtml (str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    }

    const setIndicator = window.__captureSetIndicators
    if (settled) {
      setIndicator('.area-tpl', 'idle')
      setIndicator('.area-data', 'idle')
      setIndicator('.area-output', 'ok')
    } else {
      setIndicator('.area-tpl', 'active')
      setIndicator('.area-data', 'idle')
      setIndicator('.area-output', 'pending')
    }

    window.__captureTpl.innerHTML =
      escapeHtml(tpl) + (settled ? '' : '<span class="capture-cursor">▎</span>')

    let html = window.__captureLastHtml || ''
    try {
      html = await window.__captureEngine.parseAndRender(tpl, window.__captureContext)
      if (html !== '' || !window.__captureLastHtml) {
        window.__captureLastHtml = html
      }
    } catch {}

    window.__captureOut.textContent = window.__captureLastHtml || html
  }, { tpl: templateText, settled })
}

async function screenshotWorkspace (page, file) {
  await page.locator('.playground-workspace').screenshot({
    path: file,
    type: 'png',
    scale: 'device',
    animations: 'disabled'
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

async function captureFrame (page, framesDir, framePaths, frameIndexRef, templateText, opts) {
  await setCaptureFrame(page, templateText, opts)
  const file = join(framesDir, `frame-${String(frameIndexRef.value).padStart(3, '0')}.png`)
  framePaths.push(file)
  await screenshotWorkspace(page, file)
  frameIndexRef.value++
}

async function main () {
  await run('npm', ['run', 'build:docs-liquid'], { cwd: root })
  await run('npm', ['run', 'build:contributors'], { cwd: root })
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
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
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
    const frameIndexRef = { value: 0 }

    for (let i = 0; i <= fullTemplate.length; i++) {
      const partial = fullTemplate.slice(0, i)
      const settled = i === fullTemplate.length
      await captureFrame(page, framesDir, framePaths, frameIndexRef, partial, { settled })
    }

    await encodeGif()
    await mkdir(join(root, '.local'), { recursive: true })
    await copyFile(framePaths[framePaths.length - 1], join(root, '.local/playground-gif-last-frame.png'))
    await browser.close()
    console.log(`Wrote ${outPath} (${framePaths.length} frames @ ${FPS} fps)`)
  } finally {
    server.kill()
    await rm(framesDir, { recursive: true, force: true })
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
