import { Liquid } from '../../../src/liquid'
import { Tag } from '../../../src/template/tag'
import type { Context } from '../../../src/context'
import type { TagToken, TopLevelToken } from '../../../src/tokens'

class SimpleStringTag extends Tag {
  render () {
    return 'B'
  }
}

class AsyncStringTag extends Tag {
  async render () {
    return 'B'
  }
}

class DynamicStringTag extends Tag {
  async render (ctx: Context) {
    return ctx.get(['c'])
  }
}

class ArgumentReflectorTag extends Tag {
  variable: string
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    this.variable = token.args.split('=')[1]
  }
  async render (ctx: Context) {
    return ctx.get([this.variable])
  }
}

describe('liquid#registerTag()', function () {
  it('should support render to simple string', async () => {
    const liquid = new Liquid()
    liquid.registerTag('simple-string', SimpleStringTag)
    const html = await liquid.parseAndRender(`A{% simple-string %}C`)
    return expect(html).toBe('ABC')
  })
  it('should support async tag render', async () => {
    const liquid = new Liquid()
    liquid.registerTag('async-string', AsyncStringTag)
    const html = await liquid.parseAndRender(`A{% async-string %}C`)
    return expect(html).toBe('ABC')
  })
  it('should have access to ctx in render()', async () => {
    const liquid = new Liquid()
    liquid.registerTag('dynamic-string', DynamicStringTag)
    const html = await liquid.parseAndRender(`A{% dynamic-string %}C`, {
      c: 'B'
    })
    return expect(html).toBe('ABC')
  })
  it('should have access to tag arguments', async () => {
    const liquid = new Liquid()
    liquid.registerTag('argument-reflector', ArgumentReflectorTag)
    const html = await liquid.parseAndRender(`A{% argument-reflector variable=c %}C`, {
      c: 'B'
    })
    return expect(html).toBe('ABC')
  })

  it('should not treat Object.prototype names as registered tags', () => {
    const l = new Liquid()
    expect(Object.getPrototypeOf(l.tags)).toBeNull()
    expect(() => l.parse('{% constructor %}')).toThrow('tag "constructor" not found')
  })
})
