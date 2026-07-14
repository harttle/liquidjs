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

  describe('#templateLimit', () => {
    it('should throw when rendering too many templates', async () => {
      const src = '{% for i in (1..1000) %}{{i}},{% endfor %}'
      const noLimit = new Liquid()
      const limitSmall = new Liquid({ templateLimit: 100 })
      const limitLarge = new Liquid({ templateLimit: 2001 })
      await expect(noLimit.parseAndRender(src)).resolves.toMatch(/^1,2,3,4,5,.*,999,1000,$/)
      await expect(limitSmall.parseAndRender(src)).rejects.toThrow('template limit exceeded')
      await expect(limitLarge.parseAndRender(src)).resolves.toMatch(/^1,2,3,4,5,.*,999,1000,$/)
    })

    it('should support reset when calling render', async () => {
      const src = '{% for i in (1..1000) %}{{i}},{% endfor %}'
      const liquid = new Liquid({ templateLimit: 100 })
      await expect(liquid.parseAndRender(src)).rejects.toThrow('template limit exceeded')
      await expect(liquid.parseAndRender(src, {}, { templateLimit: 2001 })).resolves.toMatch(/^1,2,3,4,5,.*,999,1000,$/)
    })

    it('should take partials into account', async () => {
      mock({
        '/small': '{% for i in (1..5) %}{{i}}{% endfor %}',
        '/large': '{% for i in (1..50000000) %}{{i}}{% endfor %}'
      })
      const liquid = new Liquid({ root: '/', templateLimit: 1000 })
      await expect(liquid.parseAndRender('{% render "large" %}')).rejects.toThrow('template limit exceeded')
      await expect(liquid.parseAndRender('{% render "small" %}')).resolves.toBe('12345')
    })

  })

  describe('#outputLengthLimit', () => {
    it('should throw when output length exceeded', async () => {
      const src = '{% for i in (1..1000) %}{{i}},{% endfor %}'
      const noLimit = new Liquid()
      const limitSmall = new Liquid({ outputLengthLimit: 10 })
      const limitLarge = new Liquid({ outputLengthLimit: 5000 })
      await expect(noLimit.parseAndRender(src)).resolves.toMatch(/^1,2,3,4,5,.*,999,1000,$/)
      await expect(limitSmall.parseAndRender(src)).rejects.toThrow('output length limit exceeded')
      await expect(limitLarge.parseAndRender(src)).resolves.toMatch(/^1,2,3,4,5,.*,999,1000,$/)
    })

    it('should support reset when calling render', async () => {
      const src = '{% for i in (1..1000) %}{{i}},{% endfor %}'
      const liquid = new Liquid({ outputLengthLimit: 10 })
      await expect(liquid.parseAndRender(src)).rejects.toThrow('output length limit exceeded')
      await expect(liquid.parseAndRender(src, {}, { outputLengthLimit: 5000 })).resolves.toMatch(/^1,2,3,4,5,.*,999,1000,$/)
    })

    it('should take partials into account', async () => {
      mock({
        '/small': 'abc',
        '/large': '{% for i in (1..1000) %}{{i}}{% endfor %}'
      })
      const liquid = new Liquid({ root: '/', outputLengthLimit: 10 })
      await expect(liquid.parseAndRender('{% render "small" %}')).resolves.toBe('abc')
      await expect(liquid.parseAndRender('{% render "large" %}')).rejects.toThrow('output length limit exceeded')
    })

    it('should enforce outputLengthLimit in sync render', () => {
      const liquid = new Liquid({ outputLengthLimit: 5 })
      expect(() => liquid.parseAndRenderSync('{% for i in (1..100) %}{{i}}{% endfor %}'))
        .toThrow('output length limit exceeded')
    })

    it('should enforce outputLengthLimit in stream render', async () => {
      const liquid = new Liquid({ outputLengthLimit: 5 })
      const tpl = liquid.parse('{% for i in (1..100) %}{{i}}{% endfor %}')
      const stream = liquid.renderToNodeStream(tpl)
      await expect(new Promise((resolve, reject) => {
        stream.on('error', reject)
        stream.on('end', resolve)
      })).rejects.toThrow('output length limit exceeded')
    })
  })

  describe('#maxDepth', () => {
    function chain (depth: number, tag: string) {
      const templates: Record<string, string> = {}
      for (let i = 0; i < depth; i++) {
        templates[`t${i}`] = i === depth - 1 ? 'done' : `{% ${tag} "t${i + 1}" %}`
      }
      return templates
    }

    it('should throw when include depth exceeded', async () => {
      const liquid = new Liquid({ templates: chain(3, 'include'), maxDepth: 2 })
      await expect(liquid.parseAndRender('{% include "t0" %}')).rejects.toThrow('template depth limit exceeded')
    })

    it('should allow include within maxDepth', async () => {
      const liquid = new Liquid({ templates: chain(2, 'include'), maxDepth: 2 })
      await expect(liquid.parseAndRender('{% include "t0" %}')).resolves.toBe('done')
    })

    it('should throw when render depth exceeded', async () => {
      const liquid = new Liquid({ templates: chain(3, 'render'), maxDepth: 2 })
      await expect(liquid.parseAndRender('{% render "t0" %}')).rejects.toThrow('template depth limit exceeded')
    })

    it('should allow render within maxDepth', async () => {
      const liquid = new Liquid({ templates: chain(2, 'render'), maxDepth: 2 })
      await expect(liquid.parseAndRender('{% render "t0" %}')).resolves.toBe('done')
    })

    it('should throw when layout depth exceeded', async () => {
      const liquid = new Liquid({
        templates: {
          a: '{% layout "b" %}body-a',
          b: '{% layout "c" %}body-b',
          c: 'body-c'
        },
        maxDepth: 2
      })
      await expect(liquid.parseAndRender('{% layout "a" %}root')).rejects.toThrow('template depth limit exceeded')
    })

    it('should allow layout within maxDepth', async () => {
      const liquid = new Liquid({
        templates: {
          a: '{% layout "b" %}body-a',
          b: 'body-b'
        },
        maxDepth: 2
      })
      await expect(liquid.parseAndRender('{% layout "a" %}root')).resolves.toBe('body-b')
    })

    it('should not count layout none toward depth', async () => {
      const liquid = new Liquid({ maxDepth: 0 })
      await expect(liquid.parseAndRender('{% layout none %}ok')).resolves.toBe('ok')
    })

    it('should default maxDepth to 128', async () => {
      const liquid = new Liquid({ templates: chain(128, 'include') })
      await expect(liquid.parseAndRender('{% include "t0" %}')).resolves.toBe('done')
      const overflow = new Liquid({ templates: chain(129, 'include') })
      await expect(overflow.parseAndRender('{% include "t0" %}')).rejects.toThrow('template depth limit exceeded')
    })

    it('should enforce maxDepth in sync render', () => {
      const liquid = new Liquid({ templates: chain(3, 'include'), maxDepth: 2 })
      expect(() => liquid.parseAndRenderSync('{% include "t0" %}')).toThrow('template depth limit exceeded')
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
