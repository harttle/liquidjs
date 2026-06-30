import { isWord } from '../util/character'

interface TrieInput<T> {
  [key: string]: T
}

export type Trie<T> = {
  data?: T
  end?: true
  needBoundary?: true
} & Record<string, any>

// Tries are built once per input object and reused: the Tokenizer rebuilds them
// on every instantiation, but `input` (operators/literalValues) is a stable
// reference. WeakMap-keying by `input` lets short-lived operator objects (and
// their tries) be garbage collected. The returned trie is treated as read-only
// by callers (matchTrie only reads it); do not mutate it.
const trieCache = new WeakMap<TrieInput<any>, Trie<any>>()

export function createTrie<T = any> (input: TrieInput<T>): Trie<T> {
  const cached = trieCache.get(input)
  if (cached) return cached
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
  trieCache.set(input, trie)
  return trie
}
