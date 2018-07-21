const resolve = require('resolve-url')
const splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^/]+?|)(\.[^./]*|))(?:[/]*)$/
const urlRe = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/
const _ = require('./underscore')

// https://github.com/jinder/path/blob/master/path.js#L567
exports.extname = function (path) {
  return splitPathRe.exec(path).slice(1)[3]
}

// https://www.npmjs.com/package/is-url
exports.valid = function (path) {
  return urlRe.test(path)
}

exports.resolve = function (root, path) {
  if (Object.prototype.toString.call(root) === '[object Array]') {
    root = root[0]
  }
  if (root && _.last(root) !== '/') {
    root += '/'
  }
  return resolve(root, path)
}
