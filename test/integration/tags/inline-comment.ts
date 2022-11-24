import { Liquid } from '../../../src/liquid'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('tags/inline-comment', function () {
  const liquid = new Liquid()
  it('should ignore plain string', async function () {
    const src = 'My name is {% # super %} Shopify.'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('My name is  Shopify.')
  })
  it('should ignore output tokens', async function () {
    const src = '{% #\n{{ foo}} \n %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('')
  })
  it('should support whitespace control', async function () {
    const src = '{%- # some comment \n -%}\nfoo'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('foo')
  })
  it('should handle hash without trailing whitespace', async function () {
    const src = '{% #some comment %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('')
  })
  it('should handle hash without leading whitespace', async function () {
    const src = '{%#some comment %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('')
  })
  it('should handle empty comment', async function () {
    const src = '{%#%}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('')
  })
  it('should support multiple lines', async function () {
    const src = [
      '{%-',
      '  # spread inline comments',
      '  # over multiple lines',
      '-%}'
    ].join('\n')
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('')
  })
  it('should enforce leading hashes', async function () {
    const src = [
      '{%-',
      '  # spread inline comments',
      '  over multiple lines',
      '-%}'
    ].join('\n')
    return expect(liquid.parseAndRender(src))
      .to.be.rejectedWith(/every line of an inline comment must start with a '#' character/)
  })
  describe('sync support', function () {
    it('should ignore plain string', function () {
      const src = 'My name is {% # super %} Shopify.'
      const html = liquid.parseAndRenderSync(src)
      return expect(html).to.equal('My name is  Shopify.')
    })
  })
  describe('liquid tag', function () {
    it('should treat lines starting with a hash as a comment', async function () {
      const src = [
        '{% liquid ',
        '  # first comment line',
        '  # second comment line',
        '',
        '  # another comment line',
        '  echo \'Hello \'',
        '',
        '  # more comments',
        '  echo \'goodbye\'',
        '-%}'
      ].join('\n')
      const html = await liquid.parseAndRender(src)
      return expect(html).to.equal('Hello goodbye')
    })
    it('should handle lots of hashes', async function () {
      const src = [
        '{% liquid',
        '  ##########################',
        '  # spread inline comments #',
        '  ##########################',
        '-%}'
      ].join('\n')
      const html = await liquid.parseAndRender(src)
      return expect(html).to.equal('')
    })
  })
})
