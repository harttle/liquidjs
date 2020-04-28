import { Liquid } from '../..'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('Issues', function () {
  it('#221 unicode blanks are not properly treated', async () => {
    const engine = new Liquid({ strictVariables: true, strictFilters: true })
    const html = engine.parseAndRenderSync('{{huh | truncate: 11}}', { huh: 'fdsafdsafdsafdsaaaaa' })
    expect(html).to.equal('fdsafdsa...')
  })
})
