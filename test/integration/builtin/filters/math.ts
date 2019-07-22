import { expect } from 'chai'
import { test, liquid } from '../../../stub/render'
import Liquid from '../../../../src/liquid'

describe('filters/math', function () {
  const l = new Liquid()

  describe('abs', function () {
    it('should return 3 for -3', () => test('{{ -3 | abs }}', '3'))
    it('should return 2 for arr[0]', () => test('{{ arr[0] | abs }}', '2'))
    it('should return convert string', () => test('{{ "-3" | abs }}', '3'))
  })
  describe('at_least', function () {
    it('{{4 | at_least: 5}} == 5', () => test('{{ 4 | at_least: 5 }}', '5'))
    it('{{4 | at_least: 3}} == 4', () => test('{{ 4 | at_least: 3 }}', '4'))
  })
  describe('at_most', function () {
    it('{{4 | at_most: 5}} == 4', () => test('{{ 4 | at_most: 5 }}', '4'))
    it('{{4 | at_most: 3}} == 3', () => test('{{ 4 | at_most: 3 }}', '3'))
  })
  describe('ceil', function () {
    it('should return "2" for 1.2', () => test('{{ 1.2 | ceil }}', '2'))
    it('should return "2" for 2.0', () => test('{{ 2.0 | ceil }}', '2'))
    it('should return "4" for 3.5', () => test('{{ "3.5" | ceil }}', '4'))
    it('should return "184" for 183.357', () => test('{{ 183.357 | ceil }}', '184'))
  })
  describe('divided_by', function () {
    it('should return 2 for 4,2', () => test('{{4 | divided_by: 2}}', '2'))
    it('should return 4 for 16,4', () => test('{{16 | divided_by: 4}}', '4'))
    it('should return 1 for 5,3', () => test('{{5 | divided_by: 3}}', (5 / 3).toString()))
    it('should convert string to number', () => test('{{"6" | divided_by: "3"}}', '2'))
  })
  describe('floor', function () {
    it('should return "1" for 1.2', () => test('{{ 1.2 | floor }}', '1'))
    it('should return "2" for 2.0', () => test('{{ 2.0 | floor }}', '2'))
    it('should return "183" for 183.357', () => test('{{ 183.357 | floor }}', '183'))
    it('should return "3" for 3.5', () => test('{{ "3.5" | floor }}', '3'))
  })
  describe('minus', function () {
    it('should return "2" for 4,2', () => test('{{ 4 | minus: 2 }}', '2'))
    it('should return "12" for 16,4', () => test('{{ 16 | minus: 4 }}', '12'))
    it('should return "171.357" for 183.357,12',
      () => test('{{ 183.357 | minus: 12 }}', '171.357'))
    it('should convert first arg as number', () => test('{{ "4" | minus: 1 }}', '3'))
    it('should convert both args as number', () => test('{{ "4" | minus: "1" }}', '3'))
  })
  describe('modulo', function () {
    it('should return "1" for 3,2', () => test('{{ 3 | modulo: 2 }}', '1'))
    it('should return "3" for 24,7', () => test('{{ 24 | modulo: 7 }}', '3'))
    it('should return "3.357" for 183.357,12', async () => {
      const html = await liquid.parseAndRender('{{ 183.357 | modulo: 12 }}')
      expect(Number(html)).to.be.closeTo(3.357, 0.001)
    })
    it('should convert string', () => test('{{ "24" | modulo: "7" }}', '3'))
  })
  describe('plus', function () {
    it('should return "6" for 4,2', () => test('{{ 4 | plus: 2 }}', '6'))
    it('should return "20" for 16,4', () => test('{{ 16 | plus: 4 }}', '20'))
    it('should return "195.357" for 183.357,12',
      () => test('{{ 183.357 | plus: 12 }}', '195.357'))
    it('should convert first arg as number', () => test('{{ "4" | plus: 2 }}', '6'))
    it('should convert both args as number', () => test('{{ "4" | plus: "2" }}', '6'))
    it('should support variable', async () => {
      const html = await l.parseAndRender('{{ 4 | plus: b }}', { b: 2 })
      expect(html).to.equal('6')
    })
  })

  describe('sort_natural', function () {
    it('should sort alphabetically', () => {
      return test(
        '{% assign my_array = "zebra, octopus, giraffe, Sally Snake" | split: ", " %}{{ my_array | sort_natural | join: ", " }}',
        'giraffe, octopus, Sally Snake, zebra'
      )
    })
    it('should sort with specified property', async () => {
      const src = '{{ students | sort_natural: "name" | map: "name" | join }}'
      const students = [{ name: 'bob' }, { name: 'alice' }, { name: 'carol' }]
      const html = await l.parseAndRender(src, { students })
      expect(html).to.equal('alice bob carol')
    })
    it('should be stable', async () => {
      const src = '{{ students | sort_natural: "age" | map: "name" | join }}'
      const students = [
        { name: 'bob', age: 1 },
        { name: 'alice', age: 1 },
        { name: 'carol', age: 1 }
      ]
      const html = await l.parseAndRender(src, { students })
      expect(html).to.equal('bob alice carol')
    })
    it('should tolerate undefined props', async () => {
      const src = '{{ students | sort_natural: "age" | map: "name" | join }}'
      const students = [
        { name: 'bob' },
        { name: 'alice', age: 2 },
        { name: 'carol' }
      ]
      const html = await l.parseAndRender(src, { students })
      expect(html).to.equal('alice bob carol')
    })
    it('should tolerate non array', async () => {
      const src = '{{ students | sort_natural: "age" | map: "name" | join }}'
      const html = await l.parseAndRender(src, { students: {} })
      expect(html).to.equal('')
    })
    it('should tolerate falsy input', async () => {
      const src = '{{ students | sort_natural: "age" | map: "name" | join }}'
      const html = await l.parseAndRender(src, { students: undefined })
      expect(html).to.equal('')
    })
  })
  describe('round', function () {
    it('should return "1" for 1.2', () => test('{{1.2|round}}', '1'))
    it('should return "3" for 2.7', () => test('{{2.7|round}}', '3'))
    it('should return "183.36" for 183.357,2',
      () => test('{{183.357|round: 2}}', '183.36'))
    it('should convert string to number', () => test('{{"2.7"|round}}', '3'))
  })
  describe('times', function () {
    it('should return "6" for 3,2', () => test('{{ 3 | times: 2 }}', '6'))
    it('should return "168" for 24,7', () => test('{{ 24 | times: 7 }}', '168'))
    it('should return "2200.284" for 183.357,12',
      () => test('{{ 183.357 | times: 12 }}', '2200.284'))
    it('should convert string to number', () => test('{{ "24" | times: "7" }}', '168'))
  })
})
