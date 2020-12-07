import { IDENTIFIER } from '../util/character'

const trie = {
  a: { n: { d: { end: true, needBoundary: true } } },
  o: { r: { end: true, needBoundary: true } },
  c: { o: { n: { t: { a: { i: { n: { s: { end: true, needBoundary: true } } } } } } } },
  '=': { '=': { end: true } },
  '!': { '=': { end: true } },
  '>': { end: true, '=': { end: true } },
  '<': { end: true, '=': { end: true } }
}

export function matchOperator (str: string, begin: number, end = str.length) {
  let node = trie
  let i = begin
  let info
  while (node[str[i]] && i < end) {
    node = node[str[i++]]
    if (node['end']) info = node
  }
  if (!info) return -1
  if (info['needBoundary'] && str.charCodeAt(i) & IDENTIFIER) return -1
  return i
}
