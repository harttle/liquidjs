import { last, isArray } from './util/underscore'

function domResolve (root, path) {
  const base = document.createElement('base')
  base.href = root

  const head = document.getElementsByTagName('head')[0]
  head.insertBefore(base, head.firstChild)

  const a = document.createElement('a')
  a.href = path
  const resolved = a.href
  head.removeChild(base)

  return resolved
}

export function resolve (filepath, root, options) {
  root = root || options.root
  if (isArray(root)) {
    root = root[0]
  }
  if (root.length && last(root) !== '/') {
    root += '/'
  }
  const url = domResolve(root, filepath)
  return url.replace(/^(\w+:\/\/[^/]+)(\/[^?]+)/, (str, origin, path) => {
    const last = path.split('/').pop()
    if (/\.\w+$/.test(last)) {
      return str
    }
    return origin + path + options.extname
  })
}

export async function read (url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText)
      } else {
        reject(new Error(xhr.statusText))
      }
    }
    xhr.onerror = () => {
      reject(new Error('An error occurred whilst receiving the response.'))
    }
    xhr.open('GET', url)
    xhr.send()
  })
}
