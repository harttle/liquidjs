import { toPromise } from '../util'
import { Context } from '../context'
import { Output } from '../template'
import { OutputToken } from '../tokens'

describe('Output', function () {
  const emitter: any = { write: (html: string) => (emitter.html += html), html: '' }
  const liquid = { options: {} } as any
  const token = { content: 'obj', input: 'obj' } as OutputToken
  beforeEach(() => { emitter.html = '' })

  it('should stringify objects', async function () {
    const scope = new Context({
      obj: { foo: { arr: ['a', 2] } }
    })
    const output = new Output(token, liquid)
    await toPromise(output.render(scope, emitter))
    return expect(emitter.html).toBe('[object Object]')
  })
  it('should skip function property', async function () {
    const scope = new Context({ obj: { foo: 'foo', bar: (x: any) => x } })
    const output = new Output(token, liquid)
    await toPromise(output.render(scope, emitter))
    return expect(emitter.html).toBe('[object Object]')
  })
  it('should respect to .toString()', async () => {
    const scope = new Context({ obj: { toString: () => 'FOO' } })
    const output = new Output(token, liquid)
    await toPromise(output.render(scope, emitter))
    return expect(emitter.html).toBe('FOO')
  })
})
