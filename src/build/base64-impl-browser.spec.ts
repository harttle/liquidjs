import * as base64 from './base64-impl-browser'
import { JSDOM } from 'jsdom'

describe('base64-impl/browser', function () {
  if (+(process.version.match(/^v(\d+)/) as RegExpMatchArray)[1] < 8) {
    console.info('jsdom not supported, skipping base64-impl-browser...')
    return
  }

  beforeEach(function () {
    const dom = new JSDOM(``, {
      url: 'https://example.com/',
      contentType: 'text/html',
      includeNodeLocations: true
    });
    (global as any).btoa = dom.window.btoa
    ;(global as any).atob = dom.window.atob
  })

  afterEach(function () {
    delete (global as any).btoa
    delete (global as any).atob
  })

  describe('#base64Encode()', function () {
    it('should encode a simple string', function () {
      expect(base64.base64Encode('one two three')).toBe('b25lIHR3byB0aHJlZQ==')
    })

    it('should encode an empty string', function () {
      expect(base64.base64Encode('')).toBe('')
    })

    it('should encode a string with special characters', function () {
      expect(base64.base64Encode('Hello, World! @#$%')).toBe('SGVsbG8sIFdvcmxkISBAIyQl')
    })

    it('should encode numeric strings', function () {
      expect(base64.base64Encode('123')).toBe('MTIz')
    })

    it('should encode boolean strings', function () {
      expect(base64.base64Encode('true')).toBe('dHJ1ZQ==')
    })
  })

  describe('#base64Decode()', function () {
    it('should decode a simple string', function () {
      expect(base64.base64Decode('b25lIHR3byB0aHJlZQ==')).toBe('one two three')
    })

    it('should decode an empty string', function () {
      expect(base64.base64Decode('')).toBe('')
    })

    it('should decode a string with special characters', function () {
      expect(base64.base64Decode('SGVsbG8sIFdvcmxkISBAIyQl')).toBe('Hello, World! @#$%')
    })

    it('should decode numeric strings', function () {
      expect(base64.base64Decode('MTIz')).toBe('123')
    })

    it('should decode boolean strings', function () {
      expect(base64.base64Decode('dHJ1ZQ==')).toBe('true')
    })
  })

  describe('round-trip encoding/decoding', function () {
    it('should encode and decode back to original', function () {
      const original = 'Hello, World!'
      const encoded = base64.base64Encode(original)
      const decoded = base64.base64Decode(encoded)
      expect(decoded).toBe(original)
    })

    it('should handle complex strings with special characters', function () {
      const original = 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?'
      const encoded = base64.base64Encode(original)
      const decoded = base64.base64Decode(encoded)
      expect(decoded).toBe(original)
    })

    it('should handle mixed unicode and ASCII', function () {
      const original = 'Hello 🌍'
      const encoded = base64.base64Encode(original)
      const decoded = base64.base64Decode(encoded)
      expect(decoded).toBe(original)
    })
  })
})
