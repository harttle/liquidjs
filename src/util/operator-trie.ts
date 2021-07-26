import { Operators } from '../render/operator'
import { IDENTIFIER, TYPES } from '../util/character'

export interface Trie {
  [key: string]: any;
}

export function createTrie (operators: Operators): Trie {
  const trie: Trie = {}
  for (const [name, handler] of Object.entries(operators)) {
    let node = trie

    for (let i = 0; i < name.length; i++) {
      const c = name[i]
      node[c] = node[c] || {}

      if (i === name.length - 1 && (TYPES[name.charCodeAt(i)] & IDENTIFIER)) {
        node[c].needBoundary = true
      }

      node = node[c]
    }

    node.handler = handler
    node.end = true
  }
  return trie
}
