import { uglify } from 'rollup-plugin-uglify'
import pkg from './package.json'
import typescript from 'rollup-plugin-typescript2'
import replace from 'rollup-plugin-replace'
import versionInjector from 'rollup-plugin-version-injector'

const version = process.env.VERSION || pkg.version
const sourcemap = true
const banner = `/*
 * liquidjs@${version}, https://github.com/harttle/liquidjs
 * (c) 2016-${new Date().getFullYear()} harttle
 * Released under the MIT License.
 */`
const treeshake = {
  propertyReadSideEffects: false
}
const tsconfig = {
  tsconfigOverride: {
    include: [ 'src' ],
    exclude: [ 'test', 'benchmark' ],
    compilerOptions: {
      target: 'es5',
      module: 'ES2015'
    }
  }
}
const versionInjection = versionInjector({
  injectInComments: false,
  injectInTags: {
    fileRegexp: /\.(ts|js|html|css)$/,
    tagId: 'VI',
    dateFormat: 'mmmm d, yyyy HH:MM:ss'
  },
  packageJson: './package.json',
  logLevel: 'info',
  logger: console,
  exclude: []
})
const input = './src/liquid.ts'
const replaceFS = {
  include: './src/liquid-options.ts',
  delimiters: ['', ''],
  './fs/node': './fs/browser'
}
const replaceStream = {
  include: './src/render/render.ts',
  delimiters: ['', ''],
  '../emitters/streamed-emitter': '../emitters/streamed-emitter-browser'
}

const nodeCjs = {
  output: [{
    file: 'dist/liquid.node.cjs.js',
    format: 'cjs',
    banner
  }],
  external: ['path', 'fs'],
  plugins: [versionInjection, typescript(tsconfig)],
  treeshake,
  input
}

const nodeEsm = {
  output: [{
    file: 'dist/liquid.node.esm.js',
    format: 'esm',
    banner
  }],
  external: ['path', 'fs'],
  plugins: [versionInjection, typescript(tsconfig)],
  treeshake,
  input
}

const browserEsm = {
  output: [{
    file: 'dist/liquid.browser.esm.js',
    format: 'esm',
    banner
  }],
  external: ['path', 'fs'],
  plugins: [
    versionInjection,
    replace(replaceFS),
    replace(replaceStream),
    typescript(tsconfig)
  ],
  treeshake,
  input
}

const browserUmd = {
  output: [{
    file: 'dist/liquid.browser.umd.js',
    name: 'liquidjs',
    format: 'umd',
    sourcemap,
    banner
  }],
  plugins: [
    versionInjection,
    replace(replaceFS),
    replace(replaceStream),
    typescript(tsconfig)
  ],
  treeshake,
  input
}

const browserMin = {
  output: [{
    file: 'dist/liquid.browser.min.js',
    name: 'liquidjs',
    format: 'umd',
    sourcemap
  }],
  plugins: [
    versionInjection,
    replace(replaceFS),
    replace(replaceStream),
    typescript(tsconfig),
    uglify()
  ],
  treeshake,
  input
}

const bundles = []
const env = process.env.BUNDLES || ''
if (env.includes('cjs')) bundles.push(nodeCjs)
if (env.includes('esm')) bundles.push(nodeEsm, browserEsm)
if (env.includes('umd')) bundles.push(browserUmd)
if (env.includes('min')) bundles.push(browserMin)
if (bundles.length === 0) bundles.push(nodeCjs, nodeEsm, browserEsm, browserUmd, browserMin)

export default bundles
