import { Trie, TrieNode, IDENTIFIER, TYPES } from '../util'

export function matchOperator (str: string, begin: number, trie: Trie, end = str.length) {
  let node: TrieNode = trie
  let i = begin
  let info
  while (node[str[i]] && i < end) {
    node = node[str[i++]]
    if (node['end']) info = node
  }
  if (!info) return -1
  if (info['needBoundary'] && (TYPES[str.charCodeAt(i)] & IDENTIFIER)) return -1
  return i
}
