import { expect } from 'chai'
import Liquid from '../../../src/liquid'

describe('drop/drop', function () {
  let liquid: Liquid
  before(() => (liquid = new Liquid()))

  class CustomDrop extends Liquid.Types.Drop {
    name: string = 'NAME'
    getName() {
      return 'GETNAME'
    }
  }
  class CustomDropWithMethodMissing extends CustomDrop {
    liquidMethodMissing(key: string) {
      return key.toUpperCase()
    }
  }
  it('should call corresponding method', async function () {
    const html = await liquid.parseAndRender(`{{obj.getName}}`, {obj: new CustomDrop()})
    expect(html).to.equal('GETNAME')
  })
  it('should read corresponding property', async function () {
    const html = await liquid.parseAndRender(`{{obj.name}}`, {obj: new CustomDrop()})
    expect(html).to.equal('NAME')
  })
  it('should output empty string if not exist', async function () {
    const html = await liquid.parseAndRender(`{{obj.foo}}`, {obj: new CustomDrop()})
    expect(html).to.equal('')
  })
  it('should respect liquidMethodMissing', async function () {
    const html = await liquid.parseAndRender(`{{obj.foo}}`, {obj: new CustomDropWithMethodMissing()})
    expect(html).to.equal('FOO')
  })
})
