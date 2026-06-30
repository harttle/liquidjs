import { test, liquid } from '../../stub/render'

describe('filters/base64', function () {
  describe('base64_encode', function () {
    it('should encode a simple string', () => {
      return test('{{ "one two three" | base64_encode }}', 'b25lIHR3byB0aHJlZQ==')
    })

    it('should encode an empty string', () => {
      return test('{{ "" | base64_encode }}', '')
    })

    it('should encode a string with special characters', () => {
      return test('{{ "Hello, World! @#$%" | base64_encode }}', 'SGVsbG8sIFdvcmxkISBAIyQl')
    })

    it('should encode unicode characters', () => {
      return test('{{ "你好世界" | base64_encode }}', '5L2g5aW95LiW55WM')
    })

    it('should handle undefined input', () => {
      return test('{{ foo | base64_encode }}', '')
    })

    it('should handle null input', () => {
      return test('{{ null | base64_encode }}', '')
    })

    it('should handle numeric input', () => {
      return test('{{ 123 | base64_encode }}', 'MTIz')
    })

    it('should handle boolean input', () => {
      return test('{{ true | base64_encode }}', 'dHJ1ZQ==')
    })
  })

  describe('base64_decode', function () {
    it('should decode a simple string', () => {
      return test('{{ "b25lIHR3byB0aHJlZQ==" | base64_decode }}', 'one two three')
    })

    it('should decode an empty string', () => {
      return test('{{ "" | base64_decode }}', '')
    })

    it('should decode a string with special characters', () => {
      return test('{{ "SGVsbG8sIFdvcmxkISBAIyQl" | base64_decode }}', 'Hello, World! @#$%')
    })

    it('should handle undefined input', () => {
      return test('{{ foo | base64_decode }}', '')
    })

    it('should handle null input', () => {
      return test('{{ null | base64_decode }}', '')
    })

    it('should handle numeric input', () => {
      return test('{{ "MTIz" | base64_decode }}', '123')
    })

    it('should handle boolean input', () => {
      return test('{{ "dHJ1ZQ==" | base64_decode }}', 'true')
    })
  })

  describe('base64_encode with Buffer input', function () {
    it('should encode a Buffer to base64 without data corruption', async () => {
      const buf = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0xff, 0xfe])
      const result = await liquid.parseAndRender('{{ data | base64_encode }}', { data: buf })
      expect(result).toBe(buf.toString('base64'))
    })

    it('should preserve bytes that are invalid UTF-8', async () => {
      const buf = Buffer.from([0x80, 0xff, 0xfe, 0x00, 0x01])
      const result = await liquid.parseAndRender('{{ data | base64_encode }}', { data: buf })
      const decoded = Buffer.from(result, 'base64')
      expect(decoded).toEqual(buf)
    })

    it('should handle an empty Buffer', async () => {
      const buf = Buffer.alloc(0)
      const result = await liquid.parseAndRender('{{ data | base64_encode }}', { data: buf })
      expect(result).toBe('')
    })

    it('should handle a Buffer containing valid UTF-8 text', async () => {
      const buf = Buffer.from('Hello World', 'utf8')
      const result = await liquid.parseAndRender('{{ data | base64_encode }}', { data: buf })
      expect(result).toBe(Buffer.from('Hello World').toString('base64'))
    })
  })

  describe('base64 round-trip', function () {
    it('should encode and decode back to original', () => {
      return test('{{ "Hello, World!" | base64_encode | base64_decode }}', 'Hello, World!')
    })

    it('should handle complex strings', () => {
      const complexString = 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?'
      return test(`{{ "${complexString}" | base64_encode | base64_decode }}`, complexString)
    })
  })
})
