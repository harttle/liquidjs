import { Liquid, Variable, analyze } from '../../../src'

describe('Variable analysis', () => {
  const engine = new Liquid()

  it('should report variables in output statements', () => {
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

  it('should report variables in filter keyword arguments', () => {
    const template = engine.parse('{{ a | default: b, allow_false: c }}')
    const analysis = analyze(template)

    const a = new Variable(['a'], { row: 1, col: 4, file: undefined })
    const b = new Variable(['b'], { row: 1, col: 17, file: undefined })
    const c = new Variable(['c'], { row: 1, col: 33, file: undefined })

    expect(analysis).toStrictEqual({
      variables: { a: [a], b: [b], c: [c] },
      globals: { a: [a], b: [b], c: [c] },
      locals: {}
    })
  })

  it('should report dotted properties', () => {
    const template = engine.parse('{{ a.b }}')
    const analysis = analyze(template)

    const v = new Variable(['a', 'b'], { row: 1, col: 4, file: undefined })

    expect(analysis).toStrictEqual({
      variables: { 'a.b': [v] },
      globals: { 'a.b': [v] },
      locals: {}
    })
  })

  it('should handle quoted properties using bracket notation', () => {
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
    const template = engine.parse('{% assign a = "foo" %}{{ a }}')
    const analysis = analyze(template)

    expect(analysis).toStrictEqual({
      variables: { a: [new Variable(['a'], { row: 1, col: 26, file: undefined })] },
      globals: { },
      locals: { a: [new Variable(['a'], { row: 1, col: 11, file: undefined })] }
    })
  })

  it('should detect when a variable is in scope', () => {
    const template = engine.parse('{{ a }}{% assign a = "foo" %}{{ a }}')
    const analysis = analyze(template)

    const as = [
      new Variable(['a'], { row: 1, col: 4, file: undefined }),
      new Variable(['a'], { row: 1, col: 33, file: undefined })
    ]

    expect(analysis).toStrictEqual({
      variables: { a: as },
      globals: { a: [as[0]] },
      locals: { a: [new Variable(['a'], { row: 1, col: 18, file: undefined })] }
    })
  })

  it('should report variables in if tags', () => {
    const template = engine.parse('{% if a %}b{% endif %}')
    const analysis = analyze(template)

    const a = new Variable(['a'], { row: 1, col: 7, file: undefined })

    expect(analysis).toStrictEqual({
      variables: { a: [a] },
      globals: { a: [a] },
      locals: {}
    })
  })

  it('should report variables in nested blocks', () => {
    const template = engine.parse('{% if true %}{% if false %}{{ a }}{% endif %}{% endif %}')
    const analysis = analyze(template)

    const a = new Variable(['a'], { row: 1, col: 31, file: undefined })

    expect(analysis).toStrictEqual({
      variables: { a: [a] },
      globals: { a: [a] },
      locals: {}
    })
  })

  it('should report variables from assign tags', () => {
    const template = engine.parse('{% assign a = b %}')
    const analysis = analyze(template)

    const a = new Variable(['a'], { row: 1, col: 11, file: undefined })
    const b = new Variable(['b'], { row: 1, col: 15, file: undefined })

    expect(analysis).toStrictEqual({
      variables: { b: [b] },
      globals: { b: [b] },
      locals: { a: [a] }
    })
  })

  it('should report variables from capture tags', () => {
    const template = engine.parse('{% capture a %}{% if b %}c{% endif %}{% endcapture %}')
    const analysis = analyze(template)

    const a = new Variable(['a'], { row: 1, col: 12, file: undefined })
    const b = new Variable(['b'], { row: 1, col: 22, file: undefined })

    expect(analysis).toStrictEqual({
      variables: { b: [b] },
      globals: { b: [b] },
      locals: { a: [a] }
    })
  })

  it('should report variables from case tags', () => {
    const source = [
      '{% case x %}',
      '{% when y %}',
      '  {{ a }}',
      '{% when z %}',
      '  {{ b }}',
      '{% else %}',
      '  {{ c }}',
      '{% endcase %}'
    ].join('\n')

    const template = engine.parse(source)
    const analysis = analyze(template)

    const refs = {
      x: [new Variable(['x'], { row: 1, col: 9, file: undefined })],
      y: [new Variable(['y'], { row: 2, col: 9, file: undefined })],
      a: [new Variable(['a'], { row: 3, col: 6, file: undefined })],
      z: [new Variable(['z'], { row: 4, col: 9, file: undefined })],
      b: [new Variable(['b'], { row: 5, col: 6, file: undefined })],
      c: [new Variable(['c'], { row: 7, col: 6, file: undefined })]
    }

    expect(analysis).toStrictEqual({
      variables: refs,
      globals: refs,
      locals: { }
    })
  })

  it('should report variables from cycle tags', () => {
    const template = engine.parse('{% cycle x: a, b %}')
    const analysis = analyze(template)

    const refs = {
      x: [new Variable(['x'], { row: 1, col: 10, file: undefined })],
      a: [new Variable(['a'], { row: 1, col: 13, file: undefined })],
      b: [new Variable(['b'], { row: 1, col: 16, file: undefined })]
    }

    expect(analysis).toStrictEqual({
      variables: refs,
      globals: refs,
      locals: { }
    })
  })

  it('should report variables from decrement tags', () => {
    const template = engine.parse('{% decrement a %}')
    const analysis = analyze(template)

    expect(analysis).toStrictEqual({
      variables: { },
      globals: { },
      locals: { a: [new Variable(['a'], { row: 1, col: 14, file: undefined })] }
    })
  })

  it('should report variables from echo tags', () => {
    const template = engine.parse('{% echo x | default: y, allow_false: z %}')
    const analysis = analyze(template)

    const refs = {
      x: [new Variable(['x'], { row: 1, col: 9, file: undefined })],
      y: [new Variable(['y'], { row: 1, col: 22, file: undefined })],
      z: [new Variable(['z'], { row: 1, col: 38, file: undefined })]
    }

    expect(analysis).toStrictEqual({
      variables: refs,
      globals: refs,
      locals: { }
    })
  })

  it('should report variables from for tags', () => {
    const source = [
      '{% for x in (1..y) %}',
      '  {{ x }}',
      '{% break %}',
      '{% else %}',
      '  {{ z }}',
      '{% continue %}',
      '{% endfor %}'
    ].join('\n')

    const template = engine.parse(source)
    const analysis = analyze(template)

    const x = [new Variable(['x'], { row: 2, col: 6, file: undefined })]
    const y = [new Variable(['y'], { row: 1, col: 17, file: undefined })]
    const z = [new Variable(['z'], { row: 5, col: 6, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { x, y, z },
      globals: { y, z },
      locals: { }
    })
  })

  it('should report variables from if tags', () => {
    const source = [
      '{% if x %}',
      '  {{ a }}',
      '{% elsif y %}',
      '  {{ b }}',
      '{% else %}',
      '  {{ c }}',
      '{% endif %}'
    ].join('\n')

    const template = engine.parse(source)
    const analysis = analyze(template)

    const refs = {
      a: [new Variable(['a'], { row: 2, col: 6, file: undefined })],
      b: [new Variable(['b'], { row: 4, col: 6, file: undefined })],
      c: [new Variable(['c'], { row: 6, col: 6, file: undefined })],
      x: [new Variable(['x'], { row: 1, col: 7, file: undefined })],
      y: [new Variable(['y'], { row: 3, col: 10, file: undefined })]
    }

    expect(analysis).toStrictEqual({
      variables: refs,
      globals: refs,
      locals: { }
    })
  })

  it('should report variables from increment tags', () => {
    const template = engine.parse('{% increment a %}')
    const analysis = analyze(template)

    expect(analysis).toStrictEqual({
      variables: { },
      globals: { },
      locals: { a: [new Variable(['a'], { row: 1, col: 14, file: undefined })] }
    })
  })

  it('should report variables from liquid tags', () => {
    const source = [
      '{% liquid',
      '  if product.title',
      '    echo foo | upcase',
      '  else',
      '    echo "product-1" | upcase',
      '  endif',
      '  ',
      '  for i in (0..5)',
      '    echo i',
      'endfor %}'
    ].join('\n')

    const template = engine.parse(source)
    const analysis = analyze(template)

    const globals = {
      'product.title': [new Variable(['product', 'title'], { row: 2, col: 6, file: undefined })],
      foo: [new Variable(['foo'], { row: 3, col: 10, file: undefined })]
    }

    const i = [new Variable(['i'], { row: 9, col: 10, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { ...globals, i },
      globals: globals,
      locals: { }
    })
  })

  it('should report variables from tablerow tags', () => {
    const template = engine.parse('{% tablerow x in y.z %}{{ x | append: a }}{% endtablerow %}')
    const analysis = analyze(template)

    const globals = {
      'y.z': [new Variable(['y', 'z'], { row: 1, col: 18, file: undefined })],
      a: [new Variable(['a'], { row: 1, col: 39, file: undefined })]
    }

    const x = [new Variable(['x'], { row: 1, col: 27, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { ...globals, x },
      globals: globals,
      locals: { }
    })
  })

  it('should report variables from unless tags', () => {
    const source = [
      '{% unless x %}',
      '  {{ a }}',
      '{% elsif y %}',
      '  {{ b }}',
      '{% else %}',
      '  {{ c }}',
      '{% endunless %}'
    ].join('\n')

    const template = engine.parse(source)
    const analysis = analyze(template)

    const refs = {
      a: [new Variable(['a'], { row: 2, col: 6, file: undefined })],
      b: [new Variable(['b'], { row: 4, col: 6, file: undefined })],
      c: [new Variable(['c'], { row: 6, col: 6, file: undefined })],
      x: [new Variable(['x'], { row: 1, col: 11, file: undefined })],
      y: [new Variable(['y'], { row: 3, col: 10, file: undefined })]
    }

    expect(analysis).toStrictEqual({
      variables: refs,
      globals: refs,
      locals: { }
    })
  })

  it('should report variables from nested tags', () => {
    const source = [
      '{% if a %}',
      '  {% for x in b %}',
      '    {% unless x == y %}',
      '      {% if 42 == c %}',
      '        {{ a }}, {{ y }}',
      '      {% endif %}',
      '    {% endunless %}',
      '  {% endfor %}',
      '{% endif %}'
    ].join('\n')

    const template = engine.parse(source)
    const analysis = analyze(template)

    const refs = {
      a: [
        new Variable(['a'], { row: 1, col: 7, file: undefined }),
        new Variable(['a'], { row: 5, col: 12, file: undefined })
      ],
      b: [new Variable(['b'], { row: 2, col: 15, file: undefined })],
      c: [new Variable(['c'], { row: 4, col: 19, file: undefined })],
      y: [
        new Variable(['y'], { row: 3, col: 20, file: undefined }),
        new Variable(['y'], { row: 5, col: 21, file: undefined })
      ]
    }

    const x = [new Variable(['x'], { row: 3, col: 15, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { ...refs, x },
      globals: refs,
      locals: { }
    })
  })

  // TODO: include
  // TODO: render
  // TODO: block
  // TODO: layout
})
