const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const version = require(path.join(root, 'package.json')).version

const fileLocal = path.join(root, 'dist/liquid.node.js')
const fileLatest = path.join(root, `dist/liquid.node.${version}.js`)

if (!fs.existsSync(fileLatest)) {
  const url = `https://unpkg.com/liquidjs@${version}/dist/liquid.node.js`
  console.log(`Downloading liquidjs@${version}...`)
  execSync(`curl -sL -o "${fileLatest}" "${url}"`)
}

execSync(`node benchmark/diff.js "${fileLocal}" "${fileLatest}"`, { cwd: root, stdio: 'inherit' })
