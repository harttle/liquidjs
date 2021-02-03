import { expect } from 'chai'
import { matchOperator } from '../../../src/parser/match-operator'
import { defaultOperators } from '../../../src/types'
import { createTrie } from '../../../src/util/operator-trie'

describe('parser/matchOperator()', function () {
  const trie = createTrie(defaultOperators)
  it('should match contains', () => {
    expect(matchOperator('contains', 0, trie)).to.equal(8)
  })
  it('should match comparision', () => {
    expect(matchOperator('>', 0, trie)).to.equal(1)
    expect(matchOperator('>=', 0, trie)).to.equal(2)
    expect(matchOperator('<', 0, trie)).to.equal(1)
    expect(matchOperator('<=', 0, trie)).to.equal(2)
  })
  it('should match binary logic', () => {
    expect(matchOperator('and', 0, trie)).to.equal(3)
    expect(matchOperator('or', 0, trie)).to.equal(2)
  })
  it('should not match if word not terminate', () => {
    expect(matchOperator('true1', 0, trie)).to.equal(-1)
    expect(matchOperator('containsa', 0, trie)).to.equal(-1)
  })
  it('should match if word boundary found', () => {
    expect(matchOperator('>=1', 0, trie)).to.equal(2)
    expect(matchOperator('contains b', 0, trie)).to.equal(8)
  })
})
