import {last, isArray} from './underscore'

const splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^/]+?|)(\.[^./]*|))(?:[/]*)$/
const urlRe = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/

// https://github.com/jinder/path/blob/master/path.js#L567
export function extname (path) {
  return splitPathRe.exec(path).slice(1)[3]
}

// https://www.npmjs.com/package/is-url
export function valid (path) {
  return urlRe.test(path)
}

export function resolve (root, path) {
  if (isArray(root)) {
    root = root[0]
  }
  if (root && last(root) !== '/') {
    root += '/'
  }
  return resolveUrl(root, path)
}

function resolveUrl (root, path) {
  const base = document.createElement('base')
  base.href = arguments[0]

  const head = document.getElementsByTagName('head')[0]
  head.insertBefore(base, head.firstChild)

  const a = document.createElement('a')
  a.href = path
  const resolved = a.href
  base.href = resolved

  head.removeChild(base)

  return resolved
}
