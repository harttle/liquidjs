import { isWord } from '../util/character'

interface TrieInput<T> {
  [key: string]: T
}

export type Trie<T> = {
  data?: T
  end?: true
  needBoundary?: true
} & Record<string, any>

export function createTrie<T = any> (input: TrieInput<T>): Trie<T> {
  const trie: Trie<T> = {}
  for (const [name, data] of Object.entries(input)) {
    let node = trie

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
