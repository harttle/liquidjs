import { last } from '../util'

function domResolve (root: string, path: string) {
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

export function resolve (root: string, filepath: string, ext: string) {
  if (root.length && last(root) !== '/') root += '/'
  const url = domResolve(root, filepath)
  return url.replace(/^(\w+:\/\/[^/]+)(\/[^?]+)/, (str, origin, path) => {
    const last = path.split('/').pop()
    if (/\.\w+$/.test(last)) return str
    return origin + path + ext
  })
}

export async function readFile (url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText as string)
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

export function readFileSync (url: string): string {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, false)
  xhr.send()
  if (xhr.status < 200 || xhr.status >= 300) {
    throw new Error(xhr.statusText)
  }
  return xhr.responseText as string
}

export async function exists (filepath: string) {
  return true
}

export function existsSync (filepath: string) {
  return true
}

export function dirname (filepath: string) {
  return domResolve(filepath, '.')
}

export const sep = '/'
