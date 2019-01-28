import shim from 'rollup-plugin-shim'
import alias from 'rollup-plugin-alias'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import pkg from './package.json'
import nodeResolve from 'rollup-plugin-node-resolve'

const fake = { fs: `export default {}`, path: `export default {}` }
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
const input = 'src/index.js'

const babelConf = {
  babelrc: false,
  'presets': [['env', { 'modules': false }]],
  'plugins': ['external-helpers']
}

export default [{
  output: [{
    file: 'dist/liquid.common.js',
    name: 'Liquid',
    format: 'cjs',
    sourcemap,
    banner
  }],
  external: ['path', 'fs'],
  plugins: [
    nodeResolve(),
    babel(babelConf)
  ],
  treeshake,
  input
}, {
  output: [{
    file: 'dist/liquid.js',
    name: 'Liquid',
    format: 'umd',
    sourcemap,
    banner
  }],
  plugins: [
    shim(fake),
    alias({
      './template': './template-browser'
    }),
    nodeResolve(),
    babel(babelConf)
  ],
  treeshake,
  input
}, {
  output: [{
    file: 'dist/liquid.min.js',
    name: 'Liquid',
    format: 'umd',
    sourcemap
  }],
  plugins: [
    shim(fake),
    nodeResolve(),
    babel(babelConf),
    uglify()
  ],
  treeshake,
  input
}]
