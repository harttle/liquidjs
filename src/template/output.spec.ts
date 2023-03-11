import { toPromise } from '../util'
import { Context } from '../context'
import { Output } from '../template'
import { OutputToken } from '../tokens'
import { defaultOptions } from '../liquid-options'

describe('Output', function () {
  const emitter: any = { write: (html: string) => (emitter.html += html), html: '' }
  const liquid = { options: {} } as any
  beforeEach(() => { emitter.html = '' })

  it('should stringify objects', async function () {
    const scope = new Context({
      foo: { obj: { arr: ['a', 2] } }
    })
    const output = new Output({ content: 'foo' } as OutputToken, liquid)
    await toPromise(output.render(scope, emitter))
    return expect(emitter.html).toBe('[object Object]')
  })
  it('should skip function property', async function () {
    const scope = new Context({ obj: { foo: 'foo', bar: (x: any) => x } })
    const output = new Output({ content: 'obj' } as OutputToken, liquid)
    await toPromise(output.render(scope, emitter))
    return expect(emitter.html).toBe('[object Object]')
  })
  it('should respect to .toString()', async () => {
    const scope = new Context({ obj: { toString: () => 'FOO' } })
    const output = new Output({ content: 'obj' } as OutputToken, liquid)
    await toPromise(output.render(scope, emitter))
    return expect(emitter.html).toBe('FOO')
  })
  it('should respect to .toString()', async () => {
    const scope = new Context({ obj: { toString: () => 'FOO' } })
    const output = new Output({ content: 'obj' } as OutputToken, liquid)
    await toPromise(output.render(scope, emitter))
    return expect(emitter.html).toBe('FOO')
  })
  describe('when keepOutputType is enabled', () => {
    const emitter: any = {
      write: (html: any) => {
        if (emitter.keepOutputType && typeof html !== 'string') {
          emitter.html = html
        } else {
          emitter.html += html as string
        }
      },
      html: '',
      keepOutputType: true
    }

    beforeEach(() => { emitter.html = '' })

    it('should respect output variable number type', async () => {
      const scope = new Context({
        foo: 42
      }, { ...defaultOptions, keepOutputType: true })
      const output = new Output({ content: 'foo' } as OutputToken, liquid)
      await toPromise(output.render(scope, emitter))
      return expect(emitter.html).toBe(42)
    })
    it('should respect output variable boolean type', async () => {
      const scope = new Context({
        foo: true
      }, { ...defaultOptions, keepOutputType: true })
      const output = new Output({ content: 'foo' } as OutputToken, liquid)
      await toPromise(output.render(scope, emitter))
      return expect(emitter.html).toBe(true)
    })
    it('should respect output variable object type', async () => {
      const scope = new Context({
        foo: 'test'
      }, { ...defaultOptions, keepOutputType: true })
      const output = new Output({ content: 'foo' } as OutputToken, liquid)
      await toPromise(output.render(scope, emitter))
      return expect(emitter.html).toBe('test')
    })
    it('should respect output variable string type', async () => {
      const scope = new Context({
        foo: { a: { b: 42 } }
      }, { ...defaultOptions, keepOutputType: true })
      const output = new Output({ content: 'foo' } as OutputToken, liquid)
      await toPromise(output.render(scope, emitter))
      return expect(emitter.html).toEqual({ a: { b: 42 } })
    })
  })
})
