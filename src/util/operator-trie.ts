import { isWord } from '../util/character'

interface TrieInput<T> {
  [key: string]: T
}

interface TrieLeafNode<T> {
  data: T;
  end: true;
  needBoundary?: true;
}

export interface Trie<T> {
  [key: string]: Trie<T> | TrieLeafNode<T>;
}

export type TrieNode<T> = Trie<T> | TrieLeafNode<T>

export function createTrie<T = any> (input: TrieInput<T>): Trie<T> {
  const trie: Trie<T> = {}
  for (const [name, data] of Object.entries(input)) {
    let node: Trie<T> | TrieLeafNode<T> = trie

    for (let i = 0; i < name.length; i++) {
      const c = name[i]
      node[c] = node[c] || {}

      if (i === name.length - 1 && isWord(name[i])) {
        node[c].needBoundary = true
      }

      node = node[c]
    }

    node.data = data
    node.end = true
  }
  return trie
}
