import { Liquid } from '../../../src/liquid'
import { mock, restore } from '../../stub/mockfs'

describe('DoS related', function () {
  describe('#parseLimit', function () {
    afterEach(restore)
    it('should throw when parse limit exceeded', async () => {
      const noLimit = new Liquid()
      const limit10 = new Liquid({ parseLimit: 10 })
      const limit90 = new Liquid({ parseLimit: 90 })
      const template = '{% capture bar %}{{ foo | bar: 3, a[3] }}{% endcapture %}'
      await expect(noLimit.parseAndRender(template)).resolves.toBe('')
      await expect(limit10.parseAndRender(template)).rejects.toThrow('parse length limit exceeded')
      await expect(limit90.parseAndRender(template)).resolves.toBe('')
    })
    it('should take included template into account', async () => {
      mock({
        '/small': 'Lorem ipsum',
        '/large': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      })
      const liquid = new Liquid({ root: '/', parseLimit: 50 })
      await expect(liquid.parseAndRender('{% include "small" %}')).resolves.toBe('Lorem ipsum')
      await expect(liquid.parseAndRender('{% include "large" %}')).rejects.toThrow('parse length limit exceeded')
    })
  })
  describe('#renderLimit', () => {
    it('should throw when rendering too many templates', async () => {
      const src = '{% for i in (1..1000) %}{{i}},{% endfor %}'
      const noLimit = new Liquid()
      const limitSmall = new Liquid({ renderLimit: 0.01 })
      const limitLarge = new Liquid({ renderLimit: 2e4 })
      await expect(noLimit.parseAndRender(src)).resolves.toMatch(/^1,2,3,4,5,.*,999,1000,$/)
      await expect(limitSmall.parseAndRender(src)).rejects.toThrow('template render limit exceeded')
      await expect(limitLarge.parseAndRender(src)).resolves.toMatch(/^1,2,3,4,5,.*,999,1000,$/)
    })
    it('should support reset when calling render', async () => {
      const src = '{% for i in (1..1000) %}{{i}},{% endfor %}'
      const liquid = new Liquid({ renderLimit: 0.01 })
      await expect(liquid.parseAndRender(src)).rejects.toThrow('template render limit exceeded')
      await expect(liquid.parseAndRender(src, {}, { renderLimit: 1e6 })).resolves.toMatch(/^1,2,3,4,5,.*,999,1000,$/)
    })
    it('should take partials into account', async () => {
      mock({
        '/small': '{% for i in (1..5) %}{{i}}{% endfor %}',
        '/large': '{% for i in (1..50000000) %}{{i}}{% endfor %}'
      })
      const liquid = new Liquid({ root: '/', renderLimit: 1000 })
      await expect(liquid.parseAndRender('{% render "large" %}')).rejects.toThrow('template render limit exceeded')
      await expect(liquid.parseAndRender('{% render "small" %}')).resolves.toBe('12345')
    })
  })
  describe('#memoryLimit', () => {
    it('should throw for too many array creation in filters', async () => {
      const array = Array(1e3).fill(0)
      const liquid = new Liquid({ memoryLimit: 100 })
      await expect(liquid.parseAndRender('{{ array | slice: 0, 3 | join }}', { array })).resolves.toBe('0 0 0')
      await expect(liquid.parseAndRender('{{ array | slice: 0, 300 | join }}', { array })).rejects.toThrow('memory alloc limit exceeded, line:1, col:1')
    })
    it('should support reset when calling render', async () => {
      const array = Array(1e3).fill(0)
      const liquid = new Liquid({ memoryLimit: 100 })
      await expect(liquid.parseAndRender('{{ array | slice: 0, 300 | join }}', { array })).rejects.toThrow('memory alloc limit exceeded, line:1, col:1')
      await expect(liquid.parseAndRender('{{ array | slice: 0, 300 | join }}', { array }, { memoryLimit: 1e3 })).resolves.toBe(Array(300).fill(0).join(' '))
    })
    it('should throw for too many array iteration in tags', async () => {
      const array = ['a']
      const liquid = new Liquid({ memoryLimit: 100 })
      const src = '{% for i in (1..count) %}{% assign array = array | concat: array %}{% endfor %}{{ array | join }}'
      await expect(liquid.parseAndRender(src, { array, count: 3 })).resolves.toBe('a a a a a a a a')
      await expect(liquid.parseAndRender(src, { array, count: 100 })).rejects.toThrow('memory alloc limit exceeded, line:1, col:26')
    })
  })
})
