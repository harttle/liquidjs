import { Liquid } from '../../../src'

describe('filters/url', () => {
  const liquid = new Liquid()
  describe('url_decode', () => {
    it('should decode %xx and +', () => {
      const html = liquid.parseAndRenderSync('{{ "%27Stop%21%27+said+Fred" | url_decode }}')
      expect(html).toEqual("'Stop!' said Fred")
    })
  })

  describe('url_encode', () => {
    it('should encode @', () => {
      const html = liquid.parseAndRenderSync('{{ "john@liquid.com" | url_encode }}')
      expect(html).toEqual('john%40liquid.com')
    })
    it('should encode <space>', () => {
      const html = liquid.parseAndRenderSync('{{ "Tetsuro Takara" | url_encode }}')
      expect(html).toEqual('Tetsuro+Takara')
    })
  })

  describe('cgi_escape', () => {
    it('should escape CGI chars', () => {
      const html = liquid.parseAndRenderSync('{{ "!\',()*\\"!" | cgi_escape }}')
      expect(html).toEqual('%21%27%2C%28%29%2A%22%21')
    })
    it('should escape space as +', () => {
      const html = liquid.parseAndRenderSync('{{ "foo, bar; baz?" | cgi_escape }}')
      expect(html).toEqual('foo%2C+bar%3B+baz%3F')
    })
  })

  describe('uri_escape', () => {
    it('should escape unsupported chars for uri', () => {
      const html = liquid.parseAndRenderSync('{{ "http://foo.com/?q=foo, \\\\bar?" | uri_escape }}')
      expect(html).toEqual('http://foo.com/?q=foo,%20%5Cbar?')
    })
    it('should not escape reserved characters', () => {
      const reserved = "!#$&'()*+,/:;=?@[]"
      const html = liquid.parseAndRenderSync('{{ reserved | uri_escape }}', { reserved })
      expect(html).toEqual(reserved)
    })
  })
})
