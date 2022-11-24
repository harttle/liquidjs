import { Operators, OperatorHandler } from '../render/operator'
import { IDENTIFIER, TYPES } from '../util/character'

interface TrieLeafNode {
  handler: OperatorHandler;
  end: true;
  needBoundary?: true;
}

export interface Trie {
  [key: string]: Trie | TrieLeafNode;
}

export type TrieNode = Trie | TrieLeafNode

export function createTrie (operators: Operators): Trie {
  const trie: Trie = {}
  for (const [name, handler] of Object.entries(operators)) {
    let node: Trie | TrieLeafNode = trie

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
