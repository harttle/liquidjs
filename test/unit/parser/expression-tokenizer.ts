import { tokenize } from '../../../src/parser/expression-tokenizer'
import { expect } from 'chai'

describe('expression tokenizer', () => {
  describe('spaces', () => {
    it('should tokenize a + b', () => {
      expect([...tokenize('a + b')]).to.deep.equal(['a', '+', 'b'])
    })
    it('should tokenize a==1', () => {
      expect([...tokenize('a==1')]).to.deep.equal(['a', '==', '1'])
    })
  })

  describe('range', () => {
    it('should tokenize (1..3) contains 3', () => {
      expect([...tokenize('(1..3)')]).to.deep.equal(['(1..3)'])
    })
  })

  describe('bracket', () => {
    it('should tokenize a[b] = c', () => {
      expect([...tokenize('a[b] = c')]).to.deep.equal(['a[b]', '=', 'c'])
    })
    it('should tokenize c[a["b"]] < c', () => {
      expect([...tokenize('c[a["b"]] < c')]).to.deep.equal(['c[a["b"]]', '<', 'c'])
    })
    it('should tokenize "][" == var', () => {
      expect([...tokenize('"][" == var')]).to.deep.equal(['"]["', '==', 'var'])
    })
  })

  describe('quotes', () => {
    it('should tokenize " " == var', () => {
      expect([...tokenize('" " == var')]).to.deep.equal(['" "', '==', 'var'])
    })
    it('should tokenize "\\\'" == var', () => {
      expect([...tokenize('"\\\'" == var')]).to.deep.equal(['"\\\'"', '==', 'var'])
    })
    it('should tokenize "\\"" == var', () => {
      expect([...tokenize('"\\"" == var')]).to.deep.equal(['"\\""', '==', 'var'])
    })
  })
})
