import { Liquid } from '../../../../src/liquid'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('tags/echo', function () {
  const liquid = new Liquid()

  it('should output literals', async function () {
    const src = '{% echo 1 %} {% echo "1" %} {% echo 1.1 %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('1 1 1.1')
  })

  it('should output variables', async function () {
    const src = '{% echo people.users[0].name %}'
    const html = await liquid.parseAndRender(src, { people: { users: [ { name: 'Sally' } ] } })
    return expect(html).to.equal('Sally')
  })

  it('should apply filters before output', async function () {
    const src = '{% echo user.name | upcase | prepend: "Hello, " | append: "!" %}'
    const html = await liquid.parseAndRender(src, { user: { name: 'Sally' } })
    return expect(html).to.equal('Hello, SALLY!')
  })

  it('should handle empty tag', async function () {
    const src = '{% echo %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('')
  })

  it('should handle extra whitespace', async function () {
    const src = `{% echo
      user.name  
      |  upcase |   prepend: 
      "Hello, " | append: "!" 
    %}`
    const html = await liquid.parseAndRender(src, { user: { name: 'Sally' } })
    return expect(html).to.equal('Hello, SALLY!')
  })
})
