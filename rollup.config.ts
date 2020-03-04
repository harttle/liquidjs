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

const cjs = {
  output: [{
    file: 'dist/liquid.cjs.js',
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

const esm = {
  output: [{
    file: 'dist/liquid.esm.js',
    format: 'esm',
    banner
  }],
  external: ['path', 'fs'],
  plugins: [
    replace({
      include: './src/liquid.ts',
      delimiters: ['', ''],
      './fs/node': './fs/browser'
    }),
    replace({
      include: './src/parser/token.ts',
      delimiters: ['', ''],
      './flatten/node': './flatten/browser'
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

const umd = {
  output: [{
    file: 'dist/liquid.js',
    name: 'liquidjs',
    format: 'umd',
    sourcemap,
    banner
  }],
  plugins: [
    replace({
      include: './src/liquid.ts',
      delimiters: ['', ''],
      './fs/node': './fs/browser'
    }),
    replace({
      include: './src/parser/token.ts',
      delimiters: ['', ''],
      './flatten/node': './flatten/browser'
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

const min = {
  output: [{
    file: 'dist/liquid.min.js',
    name: 'liquidjs',
    format: 'umd',
    sourcemap
  }],
  plugins: [
    replace({
      include: './src/liquid.ts',
      delimiters: ['', ''],
      './fs/node': './fs/browser'
    }),
    replace({
      include: './src/parser/token.ts',
      delimiters: ['', ''],
      './flatten/node': './flatten/browser'
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
if (env.includes('cjs')) bundles.push(cjs)
if (env.includes('esm')) bundles.push(esm)
if (env.includes('umd')) bundles.push(umd)
if (env.includes('min')) bundles.push(min)
if (bundles.length === 0) bundles.push(cjs, umd, min, esm)

export default bundles
