import { Liquid } from '../../../src/liquid'

describe('ownPropertyOnly / inherited array indices', function () {
  const engine = new Liquid({ ownPropertyOnly: true })

  function pollutedArrays () {
    // eslint-disable-next-line no-extend-native
    Array.prototype[0] = 'ARRAY_PROTO_POLLUTED'
    ;(Object.prototype as any).secret = 'OBJECT_PROTO_POLLUTED'
    const a: any[] = []
    a.length = 1
    const o = {}
    return {
      a,
      o,
      cleanup () {
        delete (Array.prototype as any)[0]
        delete (Object.prototype as any).secret
      }
    }
  }

  const cases: [string, (ctx: ReturnType<typeof pollutedArrays>) => object, string][] = [
    ['{{ a[0] }}', ({ a }) => ({ a }), ''],
    ['{{ a[-1] }}', ({ a }) => ({ a }), ''],
    ['{{ o.secret }}', ({ o }) => ({ o }), ''],
    ['{{ a.first }}', ({ a }) => ({ a }), ''],
    ['{{ a.last }}', ({ a }) => ({ a }), ''],
    ['{{ a | first }}', ({ a }) => ({ a }), ''],
    ['{{ a | last }}', ({ a }) => ({ a }), ''],
    ['{% assign x = a | first %}{{ x }}', ({ a }) => ({ a }), '']
  ]

  it.each(cases)('%s', function (src, scopeFn, expected) {
    const ctx = pollutedArrays()
    try {
      expect(engine.parseAndRenderSync(src, scopeFn(ctx))).toBe(expected)
    } finally {
      ctx.cleanup()
    }
  })

  it('still allows array length and size', function () {
    const { a, cleanup } = pollutedArrays()
    try {
      expect(engine.parseAndRenderSync('{{ a.size }}', { a })).toBe('1')
      const arr = [1, 2]
      expect(engine.parseAndRenderSync('{{ arr | first }}', { arr })).toBe('1')
      expect(engine.parseAndRenderSync('{{ arr[-1] }}', { arr })).toBe('2')
    } finally {
      cleanup()
    }
  })
})
