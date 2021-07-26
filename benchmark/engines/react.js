const { readFileSync } = require('fs')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const babel = require('@babel/core')
const requireFromString = require('require-from-string')

const babelConfig = {
  presets: ['@babel/preset-react', '@babel/preset-env']
}

module.exports = {
  load: path => {
    const src = readFileSync(path + '.jsx', 'utf8')
    const transformed = babel.transform(src, babelConfig)
    return requireFromString(transformed.code)
  },
  render: (Component, data) => {
    return ReactDOMServer.renderToString(React.createElement(Component, data))
  }
}
