import { uglify } from 'rollup-plugin-uglify'
import pkg from './package.json'
import typescript from 'rollup-plugin-typescript2'
import replace from 'rollup-plugin-replace'

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
const input = './src/liquid.ts'

const nodeCjs = {
  output: [{
    file: 'dist/liquid.node.cjs.js',
    format: 'cjs',
    banner
  }],
  external: ['path', 'fs'],
  plugins: [typescript({
    tsconfigOverride: {
      include: [ 'src' ],
      exclude: [ 'test', 'benchmark' ],
      compilerOptions: {
        target: 'ES2017',
        module: 'ES2015'
      }
    }
  })],
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
  plugins: [typescript({
    tsconfigOverride: {
      include: [ 'src' ],
      exclude: [ 'test', 'benchmark' ],
      compilerOptions: {
        target: 'ES2017',
        module: 'ES2015'
      }
    }
  })],
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
    replace({
      include: './src/liquid-options.ts',
      delimiters: ['', ''],
      './fs/node': './fs/browser'
    }),
    typescript({
      tsconfigOverride: {
        include: [ 'src' ],
        exclude: [ 'test', 'benchmark' ],
        compilerOptions: {
          target: 'ES2017',
          module: 'ES2015'
        }
      }
    })
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
    replace({
      include: './src/liquid-options.ts',
      delimiters: ['', ''],
      './fs/node': './fs/browser'
    }),
    typescript({
      tsconfigOverride: {
        include: [ 'src' ],
        exclude: [ 'test', 'benchmark' ],
        compilerOptions: {
          target: 'es5',
          module: 'ES2015'
        }
      }
    })
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
    replace({
      include: './src/liquid-options.ts',
      delimiters: ['', ''],
      './fs/node': './fs/browser'
    }),
    typescript({
      tsconfigOverride: {
        include: [ 'src' ],
        exclude: [ 'test', 'benchmark' ],
        compilerOptions: {
          target: 'es5',
          module: 'ES2015'
        }
      }
    }),
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
