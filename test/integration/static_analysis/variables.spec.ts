import { Liquid, Variable, analyze } from '../../../src'

describe('Variable analysis', () => {
  it('should report variables in output statements', () => {
    const engine = new Liquid()
    const template = engine.parse('{{ a }}')
    const analysis = analyze(template)

    const a = new Variable(['a'], { row: 1, col: 4, file: undefined })

    expect(analysis).toStrictEqual({
      variables: { a: [a] },
      globals: { a: [a] },
      locals: {}
    })
  })

  it('should report all locations of a variable', () => {
    const engine = new Liquid()
    const template = engine.parse('{{ a }}\n{{ a }}')
    const analysis = analyze(template)

    const as = [
      new Variable(['a'], { row: 1, col: 4, file: undefined }),
      new Variable(['a'], { row: 2, col: 4, file: undefined })
    ]

    expect(analysis).toStrictEqual({
      variables: { a: as },
      globals: { a: as },
      locals: {}
    })
  })

  it('should report variables in filter arguments', () => {
    const engine = new Liquid()
    const template = engine.parse('{{ a | join: b }}')
    const analysis = analyze(template)

    const a = new Variable(['a'], { row: 1, col: 4, file: undefined })
    const b = new Variable(['b'], { row: 1, col: 14, file: undefined })

    expect(analysis).toStrictEqual({
      variables: { a: [a], b: [b] },
      globals: { a: [a], b: [b] },
      locals: {}
    })
  })

  it('should report dotted properties', () => {
    const engine = new Liquid()
    const template = engine.parse('{{ a.b }}')
    const analysis = analyze(template)

    const v = new Variable(['a', 'b'], { row: 1, col: 4, file: undefined })

    expect(analysis).toStrictEqual({
      variables: { 'a.b': [v] },
      globals: { 'a.b': [v] },
      locals: {}
    })
  })

  it('should handle quoted properties', () => {
    const engine = new Liquid()
    const template = engine.parse('{{ a["b c"] }}')
    const analysis = analyze(template)

    const v = new Variable(['a', 'b c'], { row: 1, col: 4, file: undefined })

    expect(analysis).toStrictEqual({
      variables: { "a['b c']": [v] },
      globals: { "a['b c']": [v] },
      locals: {}
    })
  })

  it('should report nested variables', () => {
    const engine = new Liquid()
    const template = engine.parse('{{ a[b.c] }}')
    const analysis = analyze(template)

    const bc = new Variable(['b', 'c'], { row: 1, col: 6, file: undefined })
    const a = new Variable(['a', bc], { row: 1, col: 4, file: undefined })

    expect(analysis).toStrictEqual({
      variables: { 'a[b.c]': [a], 'b.c': [bc] },
      globals: { 'a[b.c]': [a], 'b.c': [bc] },
      locals: {}
    })
  })

  it('should report deeply nested variables', () => {
    const engine = new Liquid()
    const template = engine.parse('{{ d[a[b.c]] }}')
    const analysis = analyze(template)

    const bc = new Variable(['b', 'c'], { row: 1, col: 8, file: undefined })
    const a = new Variable(['a', bc], { row: 1, col: 6, file: undefined })
    const d = new Variable(['d', a], { row: 1, col: 4, file: undefined })

    expect(analysis).toStrictEqual({
      variables: { 'd[a[b.c]]': [d], 'a[b.c]': [a], 'b.c': [bc] },
      globals: { 'd[a[b.c]]': [d], 'a[b.c]': [a], 'b.c': [bc] },
      locals: {}
    })
  })

  it('should detect local variables', () => {
    const engine = new Liquid()
    const template = engine.parse('{% assign a = "foo" %}{{ a }}')
    const analysis = analyze(template)

    expect(analysis).toStrictEqual({
      variables: { a: [new Variable(['a'], { row: 1, col: 26, file: undefined })] },
      globals: { },
      locals: { a: [new Variable(['a'], { row: 1, col: 1, file: undefined })] }
    })
  })

  it('should detect when a variable is in scope', () => {
    const engine = new Liquid()
    const template = engine.parse('{{ a }}{% assign a = "foo" %}{{ a }}')
    const analysis = analyze(template)

    const as = [
      new Variable(['a'], { row: 1, col: 4, file: undefined }),
      new Variable(['a'], { row: 1, col: 33, file: undefined })
    ]

    expect(analysis).toStrictEqual({
      variables: { a: as },
      globals: { a: [as[0]] },
      locals: { a: [new Variable(['a'], { row: 1, col: 8, file: undefined })] }
    })
  })

  it('should report variables in if tags', () => {
    const engine = new Liquid()
    const template = engine.parse('{% if a %}b{% endif %}')
    const analysis = analyze(template)

    // TODO: Tokens created with `new Value(someString)` don't have correct begin and end
    // const a = new Variable(['a'], { row: 1, col: 7, file: undefined })
    const a = new Variable(['a'], { row: 1, col: 1, file: undefined })

    expect(analysis).toStrictEqual({
      variables: { a: [a] },
      globals: { a: [a] },
      locals: {}
    })
  })

  it('should report variables in nested blocks', () => {
    const engine = new Liquid()
    const template = engine.parse('{% if true %}{% if false %}{{ a }}{% endif %}{% endif %}')
    const analysis = analyze(template)

    const a = new Variable(['a'], { row: 1, col: 31, file: undefined })

    expect(analysis).toStrictEqual({
      variables: { a: [a] },
      globals: { a: [a] },
      locals: {}
    })
  })
})
