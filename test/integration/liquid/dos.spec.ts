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
    it('should enforce renderLimit when for body has no template nodes', () => {
      const liquid = new Liquid({ memoryLimit: 1e9, renderLimit: 1 })
      expect(() => liquid.parseAndRenderSync('{%- for i in (1..5000000) -%}{%- endfor -%}', {}))
        .toThrow('template render limit exceeded')
    })
    it('should enforce renderLimit when tablerow body has no template nodes', () => {
      const liquid = new Liquid({ memoryLimit: 1e9, renderLimit: 1 })
      expect(() => liquid.parseAndRenderSync('{%- tablerow i in (1..1000000) cols:1 -%}{%- endtablerow -%}', {}))
        .toThrow('template render limit exceeded')
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
    it('should charge pop allocation to memoryLimit', async () => {
      const array = Array(1e3).fill(0)
      const liquid = new Liquid({ memoryLimit: 100 })
      await expect(liquid.parseAndRender('{{ array | pop | size }}', { array })).rejects.toThrow('memory alloc limit exceeded')
    })
    it('should charge sample allocation to memoryLimit', async () => {
      const array = Array(1e3).fill(0)
      const liquid = new Liquid({ memoryLimit: 100 })
      await expect(liquid.parseAndRender('{{ array | sample: 1 | size }}', { array })).rejects.toThrow('memory alloc limit exceeded')
    })
    it('should charge join by produced output size, not element count', () => {
      const array = ['a'.repeat(100), 'b'.repeat(100)]
      const liquid = new Liquid({ memoryLimit: 100 })
      expect(() => liquid.parseAndRenderSync('{{ array | join: "" }}', { array }))
        .toThrow('memory alloc limit exceeded')
    })
    it('should allow join within memoryLimit', () => {
      const array = ['a'.repeat(20), 'b'.repeat(20)]
      const liquid = new Liquid({ memoryLimit: 100 })
      expect(liquid.parseAndRenderSync('{{ array | join: "" }}', { array })).toBe('a'.repeat(20) + 'b'.repeat(20))
    })
    it('should prevent concat doubling from bypassing join memoryLimit', () => {
      const liquid = new Liquid({ memoryLimit: 1e4 })
      const src = '{%- assign a = s | split: "NOSEP" -%}' +
        '{%- assign a = a | concat: a -%}{%- assign a = a | concat: a -%}{%- assign a = a | concat: a -%}' +
        '{{ a | join: "" | size }}'
      expect(() => liquid.parseAndRenderSync(src, { s: 'a'.repeat(5000) }))
        .toThrow('memory alloc limit exceeded')
    })
    it('should charge array_to_sentence_string by produced output size', () => {
      const array = ['a'.repeat(100), 'b'.repeat(100), 'c'.repeat(100)]
      const liquid = new Liquid({ memoryLimit: 100 })
      expect(() => liquid.parseAndRenderSync('{{ array | array_to_sentence_string }}', { array }))
        .toThrow('memory alloc limit exceeded')
    })
    it('should charge json serialization of concat-doubled arrays', () => {
      const liquid = new Liquid({ memoryLimit: 1e4 })
      const src = '{%- assign a = s | split: "NOSEP" -%}' +
        '{%- assign a = a | concat: a -%}{%- assign a = a | concat: a -%}{%- assign a = a | concat: a -%}' +
        '{{ a | json | size }}'
      expect(() => liquid.parseAndRenderSync(src, { s: 'a'.repeat(5000) }))
        .toThrow('memory alloc limit exceeded')
    })
    it('should charge inspect serialization of concat-doubled arrays', () => {
      const liquid = new Liquid({ memoryLimit: 1e4 })
      const src = '{%- assign a = s | split: "NOSEP" -%}' +
        '{%- assign a = a | concat: a -%}{%- assign a = a | concat: a -%}{%- assign a = a | concat: a -%}' +
        '{{ a | inspect | size }}'
      expect(() => liquid.parseAndRenderSync(src, { s: 'a'.repeat(5000) }))
        .toThrow('memory alloc limit exceeded')
    })
    it('should charge strip_html input length to memoryLimit', () => {
      const liquid = new Liquid({ memoryLimit: 100 })
      expect(() => liquid.parseAndRenderSync('{{ s | strip_html }}', { s: 'a'.repeat(200) }))
        .toThrow('memory alloc limit exceeded')
    })
  })
  describe('strip_html ReDoS', () => {
    // Regression for O(n^2) backtracking on unclosed `<script` / `<style` openers.
    // The previous regex stalled the event loop for ~10s on 350KB of `'<script'.repeat`.
    // The per-test timeout below caps total time; an O(n^2) regression would blow it.
    it('should handle many unclosed <script openers in linear time', () => {
      const liquid = new Liquid()
      const payload = '<script'.repeat(50000)
      expect(liquid.parseAndRenderSync('{{ x | strip_html }}', { x: payload })).toBe(payload)
    }, 1000)
    it('should handle many unclosed <style openers in linear time', () => {
      const liquid = new Liquid()
      const payload = '<style'.repeat(50000)
      expect(liquid.parseAndRenderSync('{{ x | strip_html }}', { x: payload })).toBe(payload)
    }, 1000)
    it('should handle <script openers that have > but no </script> in linear time', () => {
      const liquid = new Liquid()
      const payload = '<script>foo'.repeat(50000)
      expect(liquid.parseAndRenderSync('{{ x | strip_html }}', { x: payload })).toBe('foo'.repeat(50000))
    }, 1000)
  })
})
