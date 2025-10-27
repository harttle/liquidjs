import { test } from '../../stub/render'

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
