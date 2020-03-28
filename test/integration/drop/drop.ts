import { expect } from 'chai'
import { Liquid, Drop } from '../../../src/liquid'

describe('drop/drop', function () {
  let liquid: Liquid
  before(() => (liquid = new Liquid()))

  class CustomDrop extends Drop {
    private name = 'NAME'
    public getName () {
      return 'GET NAME'
    }
  }
  class CustomDropWithMethodMissing extends CustomDrop {
    public liquidMethodMissing (key: string) {
      return key.toUpperCase()
    }
  }
  class PromiseDrop extends Drop {
    private name = Promise.resolve('NAME')
    public async getName () {
      return 'GET NAME'
    }
    public async liquidMethodMissing (key: string) {
      return key.toUpperCase()
    }
  }
  it('should call corresponding method when output', async function () {
    const html = await liquid.parseAndRender(`{{obj.getName}}`, { obj: new CustomDrop() })
    expect(html).to.equal('GET NAME')
  })
  it('should call corresponding method when expression evaluates', async function () {
    const html = await liquid.parseAndRender(`{% if obj.getName == "GET NAME" %}true{% endif %}`, { obj: new CustomDrop() })
    expect(html).to.equal('true')
  })
  it('should read corresponding property', async function () {
    const html = await liquid.parseAndRender(`{{obj.name}}`, { obj: new CustomDrop() })
    expect(html).to.equal('NAME')
  })
  it('should output empty string if not exist', async function () {
    const html = await liquid.parseAndRender(`{{obj.foo}}`, { obj: new CustomDrop() })
    expect(html).to.equal('')
  })
  it('should respect liquidMethodMissing', async function () {
    const html = await liquid.parseAndRender(`{{obj.foo}}`, { obj: new CustomDropWithMethodMissing() })
    expect(html).to.equal('FOO')
  })
  it('should call corresponding promise method', async function () {
    const html = await liquid.parseAndRender(`{{obj.getName}}`, { obj: new PromiseDrop() })
    expect(html).to.equal('GET NAME')
  })
  it('should read corresponding promise property', async function () {
    const html = await liquid.parseAndRender(`{{obj.name}}`, { obj: new PromiseDrop() })
    expect(html).to.equal('NAME')
  })
  it('should resolve before calling filters', async function () {
    const html = await liquid.parseAndRender(`{{obj.name | downcase}}`, { obj: new PromiseDrop() })
    expect(html).to.equal('name')
  })
  it('should support promise returned by liquidMethodMissing', async function () {
    const html = await liquid.parseAndRender(`{{obj.foo}}`, { obj: new PromiseDrop() })
    expect(html).to.equal('FOO')
  })
})
