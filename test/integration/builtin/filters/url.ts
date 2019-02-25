import { test } from '../../../stub/render'

describe('filters/url', function () {
  describe('url_decode', function () {
    it('should decode %xx and +',
      () => test('{{ "%27Stop%21%27+said+Fred" | url_decode }}', "'Stop!' said Fred"))
  })

  describe('url_encode', function () {
    it('should encode @',
      () => test('{{ "john@liquid.com" | url_encode }}', 'john%40liquid.com'))
    it('should encode <space>',
      () => test('{{ "Tetsuro Takara" | url_encode }}', 'Tetsuro+Takara'))
  })
})
