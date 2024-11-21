import { Liquid, Variable, analyzeSync } from '../../../src'

describe('Variable analysis', () => {
  const engine = new Liquid()

  it('should report variables in output statements', () => {
    const template = engine.parse('{{ a }}')
    const analysis = analyzeSync(template)

    const a = new Variable(['a'], { row: 1, col: 4, file: undefined })

    expect(analysis).toStrictEqual({
      variables: { a: [a] },
      globals: { a: [a] },
      locals: {}
    })
  })

  it('should report all locations of a variable', () => {
    const template = engine.parse('{{ a }}\n{{ a }}')
    const analysis = analyzeSync(template)

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

  it('should include the template name if available', () => {
    const engine = new Liquid({ templates: { 'a': '{{ b }}' } })
    const template = engine.parseFileSync('a')
    const analysis = analyzeSync(template)

    const b = [new Variable(['b'], { row: 1, col: 4, file: 'a' })]

    expect(analysis).toStrictEqual({
      variables: { b },
      globals: { b },
      locals: {}
    })
  })

  it('should report variables in filter arguments', () => {
    const template = engine.parse('{{ a | join: b }}')
    const analysis = analyzeSync(template)

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
    const analysis = analyzeSync(template)

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
    const analysis = analyzeSync(template)

    const a = [new Variable(['a', 'b'], { row: 1, col: 4, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { a },
      globals: { a },
      locals: {}
    })
  })

  it('should handle quoted properties using bracket notation', () => {
    const template = engine.parse('{{ a["b c"] }}')
    const analysis = analyzeSync(template)

    const a = [new Variable(['a', 'b c'], { row: 1, col: 4, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { a },
      globals: { a },
      locals: {}
    })
  })

  it('should handle bracketed variable root', () => {
    const template = engine.parse('{{ ["a"] }}')
    const analysis = analyzeSync(template)

    const a = [new Variable(['a'], { row: 1, col: 4, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { a },
      globals: { a },
      locals: {}
    })
  })

  it('should handle paths containing array indices', () => {
    const template = engine.parse('{{ a[1] }}')
    const analysis = analyzeSync(template)

    const a = [new Variable(['a', 1], { row: 1, col: 4, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { a },
      globals: { a },
      locals: {}
    })
  })

  it('should handle paths that start with a nested path', () => {
    const template = engine.parse('{{ [a.b] }}')
    const analysis = analyzeSync(template)

    const a = [new Variable(['a', 'b'], { row: 1, col: 4, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { a },
      globals: { a },
      locals: {}
    })
  })

  it('should handle paths that start with bracketed notation', () => {
    const template = engine.parse('{{ ["a.b"] }}')
    const analysis = analyzeSync(template)

    const ab = [new Variable(['a.b'], { row: 1, col: 4, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { 'a.b': ab },
      globals: { 'a.b': ab },
      locals: {}
    })
  })

  it('should report nested variables', () => {
    const template = engine.parse('{{ a[b.c] }}')
    const analysis = analyzeSync(template)

    const bc = new Variable(['b', 'c'], { row: 1, col: 6, file: undefined })
    const a = new Variable(['a', bc], { row: 1, col: 4, file: undefined })

    expect(analysis).toStrictEqual({
      variables: { 'a': [a], 'b': [bc] },
      globals: { 'a': [a], 'b': [bc] },
      locals: {}
    })
  })

  it('should report deeply nested variables', () => {
    const template = engine.parse('{{ d[a[b.c]] }}')
    const analysis = analyzeSync(template)

    const bc = new Variable(['b', 'c'], { row: 1, col: 8, file: undefined })
    const a = new Variable(['a', bc], { row: 1, col: 6, file: undefined })
    const d = new Variable(['d', a], { row: 1, col: 4, file: undefined })

    expect(analysis).toStrictEqual({
      variables: { 'd': [d], 'a': [a], 'b': [bc] },
      globals: { 'd': [d], 'a': [a], 'b': [bc] },
      locals: {}
    })
  })

  it('should report deeply nested global and local variables', () => {
    const template = engine.parse('{% assign b = null %}{{ d[a[b.c]] }}')
    const analysis = analyzeSync(template)

    const bc = new Variable(['b', 'c'], { row: 1, col: 29, file: undefined })
    const a = new Variable(['a', bc], { row: 1, col: 27, file: undefined })
    const d = new Variable(['d', a], { row: 1, col: 25, file: undefined })

    expect(analysis).toStrictEqual({
      variables: { 'd': [d], 'a': [a], 'b': [bc] },
      globals: { 'd': [d], 'a': [a] },
      locals: { 'b': [new Variable(['b'], { row: 1, col: 11, file: undefined })] }
    })
  })

  it('should group variables by their root value', () => {
    const template = engine.parse('{{ a.b }} {{ a.c }}')
    const analysis = analyzeSync(template)

    const a = [
      new Variable(['a', 'b'], { row: 1, col: 4, file: undefined }),
      new Variable(['a', 'c'], { row: 1, col: 14, file: undefined })
    ]

    expect(analysis).toStrictEqual({
      variables: { a },
      globals: { a },
      locals: {}
    })
  })

  it('should detect local variables', () => {
    const template = engine.parse('{% assign a = "foo" %}{{ a }}')
    const analysis = analyzeSync(template)

    expect(analysis).toStrictEqual({
      variables: { a: [new Variable(['a'], { row: 1, col: 26, file: undefined })] },
      globals: { },
      locals: { a: [new Variable(['a'], { row: 1, col: 11, file: undefined })] }
    })
  })

  it('should detect when a variable is in scope', () => {
    const template = engine.parse('{{ a }}{% assign a = "foo" %}{{ a }}')
    const analysis = analyzeSync(template)

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
    const analysis = analyzeSync(template)

    const a = [new Variable(['a'], { row: 1, col: 7, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { a },
      globals: { a },
      locals: {}
    })
  })

  it('should report variables in nested blocks', () => {
    const template = engine.parse('{% if true %}{% if false %}{{ a }}{% endif %}{% endif %}')
    const analysis = analyzeSync(template)

    const a = [new Variable(['a'], { row: 1, col: 31, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { a },
      globals: { a },
      locals: {}
    })
  })

  it('should report variables from assign tags', () => {
    const template = engine.parse('{% assign a = b %}')
    const analysis = analyzeSync(template)

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
    const analysis = analyzeSync(template)

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
    const analysis = analyzeSync(template)

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
    const analysis = analyzeSync(template)

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
    const analysis = analyzeSync(template)

    expect(analysis).toStrictEqual({
      variables: { },
      globals: { },
      locals: { a: [new Variable(['a'], { row: 1, col: 14, file: undefined })] }
    })
  })

  it('should report variables from echo tags', () => {
    const template = engine.parse('{% echo x | default: y, allow_false: z %}')
    const analysis = analyzeSync(template)

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
      '{% for x in (1..y) limit: a %}',
      '  {{ x }} {{ forloop.index }} {{ forloop.first }}',
      '{% break %}',
      '{% else %}',
      '  {{ z }}',
      '{% continue %}',
      '{% endfor %}'
    ].join('\n')

    const template = engine.parse(source)
    const analysis = analyzeSync(template)

    const a = [new Variable(['a'], { row: 1, col: 27, file: undefined })]
    const x = [new Variable(['x'], { row: 2, col: 6, file: undefined })]
    const y = [new Variable(['y'], { row: 1, col: 17, file: undefined })]
    const z = [new Variable(['z'], { row: 5, col: 6, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: {
        a,
        x,
        y,
        z,
        'forloop': [
          new Variable(['forloop', 'index'], { row: 2, col: 14, file: undefined }),
          new Variable(['forloop', 'first'], { row: 2, col: 34, file: undefined })
        ]
      },
      globals: { y, a, z },
      locals: {}
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
    const analysis = analyzeSync(template)

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
    const analysis = analyzeSync(template)

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
    const analysis = analyzeSync(template)

    const globals = {
      'product': [new Variable(['product', 'title'], { row: 2, col: 6, file: undefined })],
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
    const template = engine.parse('{% tablerow x in y.z cols:2 %}{{ x | append: a }}{% endtablerow %}')
    const analysis = analyzeSync(template)

    const globals = {
      'y': [new Variable(['y', 'z'], { row: 1, col: 18, file: undefined })],
      a: [new Variable(['a'], { row: 1, col: 46, file: undefined })]
    }

    const x = [new Variable(['x'], { row: 1, col: 34, file: undefined })]

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
    const analysis = analyzeSync(template)

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
    const analysis = analyzeSync(template)

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

  it('should report variables from included templates with a string name', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x }}' } })
    const template = engine.parse('{% include "a" %}')
    const analysis = analyzeSync(template)

    const x = [new Variable(['x'], { row: 1, col: 4, file: 'a' })]

    expect(analysis).toStrictEqual({
      variables: { x },
      globals: { x },
      locals: { }
    })
  })

  it('should ignore included templates when partials is set to false', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x }}' } })
    const template = engine.parse('{% include "a" %}')
    const analysis = analyzeSync(template, false)

    expect(analysis).toStrictEqual({
      variables: { },
      globals: { },
      locals: { }
    })
  })

  it('should throw an error if an included template does not exist', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x }}' } })
    const template = engine.parse('{% include "b" %}')

    expect(() => analyzeSync(template)).toThrow('Failed to lookup "b"')
  })

  it('should ignore templates included with a dynamic variable name', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x }}' } })
    const template = engine.parse('{% include a %}')
    const analysis = analyzeSync(template)

    const a = [new Variable(['a'], { row: 1, col: 12, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { a },
      globals: { a },
      locals: { }
    })
  })

  it('should report local variables from included templates', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x }}{% assign y = 42 %}' } })
    const template = engine.parse('{% include "a" %}{{ y }}')
    const analysis = analyzeSync(template)

    const x = [new Variable(['x'], { row: 1, col: 4, file: 'a' })]

    expect(analysis).toStrictEqual({
      variables: { x, y: [new Variable(['y'], { row: 1, col: 21, file: undefined })] },
      globals: { x },
      locals: { y: [new Variable(['y'], { row: 1, col: 18, file: 'a' })] }
    })
  })

  it('should analyze included templates only once', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x }}' } })
    const template = engine.parse('{% include "a" %}{% include "a" %}')
    const analysis = analyzeSync(template)

    const x = [new Variable(['x'], { row: 1, col: 4, file: 'a' })]

    expect(analysis).toStrictEqual({
      variables: { x },
      globals: { x },
      locals: { }
    })
  })

  it('should handle templates that are included recursively', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x }}{% include "a" %}' } })
    const template = engine.parse('{% include "a" %}')
    const analysis = analyzeSync(template)

    const x = [new Variable(['x'], { row: 1, col: 4, file: 'a' })]

    expect(analysis).toStrictEqual({
      variables: { x },
      globals: { x },
      locals: { }
    })
  })

  it('should report variables from included templates with a bound variable', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x | append: y }}{{ a }}' } })
    const template = engine.parse('{% include "a" with z %}') // z is aliased as a
    const analysis = analyzeSync(template)

    const a = [new Variable(['a'], { row: 1, col: 23, file: 'a' })]
    const x = [new Variable(['x'], { row: 1, col: 4, file: 'a' })]
    const y = [new Variable(['y'], { row: 1, col: 16, file: 'a' })]
    const z = [new Variable(['z'], { row: 1, col: 21, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { z, x, y, a },
      globals: { z, x, y },
      locals: { }
    })
  })

  it('should report variables from included templates with keyword arguments', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x | append: y }}' } })
    const template = engine.parse('{% include "a" x:y z:42 %}{{ x }}')
    const analysis = analyzeSync(template)

    const x = [
      new Variable(['x'], { row: 1, col: 4, file: 'a' }),
      new Variable(['x'], { row: 1, col: 30, file: undefined })
    ]

    const y = [
      new Variable(['y'], { row: 1, col: 18, file: undefined }),
      new Variable(['y'], { row: 1, col: 16, file: 'a' })
    ]

    expect(analysis).toStrictEqual({
      variables: { x, y },
      globals: { x: [x[1]], y },
      locals: { }
    })
  })

  it('should handle jekyll style includes', () => {
    const engine = new Liquid({ templates: { 'a': '{{ include.x | append: y }}' }, jekyllInclude: true })
    const template = engine.parse('{% include a x=y z=42 %}{{ x }}')
    const analysis = analyzeSync(template)

    const include = [new Variable(['include', 'x'], { row: 1, col: 4, file: 'a' })]
    const x = [new Variable(['x'], { row: 1, col: 28, file: undefined })]

    const y = [
      new Variable(['y'], { row: 1, col: 16, file: undefined }),
      new Variable(['y'], { row: 1, col: 24, file: 'a' })
    ]

    expect(analysis).toStrictEqual({
      variables: { include, x, y },
      globals: { x, y },
      locals: { }
    })
  })

  it('should report variables from rendered templates', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x }}' } })
    const template = engine.parse('{% render "a" %}')
    const analysis = analyzeSync(template)

    const x = [new Variable(['x'], { row: 1, col: 4, file: 'a' })]

    expect(analysis).toStrictEqual({
      variables: { x },
      globals: { x },
      locals: { }
    })
  })

  it('should throw an error if a rendered template does not exist', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x }}' } })
    const template = engine.parse('{% render "b" %}')

    expect(() => analyzeSync(template)).toThrow('Failed to lookup "b"')
  })

  it('should ignore rendered templates when partials is set to false', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x }}' } })
    const template = engine.parse('{% render "a" %}')
    const analysis = analyzeSync(template, false)

    expect(analysis).toStrictEqual({
      variables: { },
      globals: { },
      locals: { }
    })
  })

  it('should report local variables from rendered templates', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x }}{% assign y = 42 %}' } })
    const template = engine.parse('{% render "a" %}{{ y }}')
    const analysis = analyzeSync(template)

    const x = [new Variable(['x'], { row: 1, col: 4, file: 'a' })]

    expect(analysis).toStrictEqual({
      variables: { x, y: [new Variable(['y'], { row: 1, col: 20, file: undefined })] },
      globals: { x },
      locals: { y: [new Variable(['y'], { row: 1, col: 18, file: 'a' })] }
    })
  })

  it('should analyze rendered templates only once', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x }}' } })
    const template = engine.parse('{% render "a" %}{% render "a" %}')
    const analysis = analyzeSync(template)

    const x = [new Variable(['x'], { row: 1, col: 4, file: 'a' })]

    expect(analysis).toStrictEqual({
      variables: { x },
      globals: { x },
      locals: { }
    })
  })

  it('should handle templates that are rendered recursively', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x }}{% render "a" %}' } })
    const template = engine.parse('{% render "a" %}')
    const analysis = analyzeSync(template)

    const x = [new Variable(['x'], { row: 1, col: 4, file: 'a' })]

    expect(analysis).toStrictEqual({
      variables: { x },
      globals: { x },
      locals: { }
    })
  })

  it('should report variables from rendered templates with a bound variable', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x | append: y }}{{ a }}' } })
    const template = engine.parse('{% render "a" with z %}') // z is aliased as a
    const analysis = analyzeSync(template)

    const a = [new Variable(['a'], { row: 1, col: 23, file: 'a' })]
    const x = [new Variable(['x'], { row: 1, col: 4, file: 'a' })]
    const y = [new Variable(['y'], { row: 1, col: 16, file: 'a' })]
    const z = [new Variable(['z'], { row: 1, col: 20, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { z, x, y, a },
      globals: { z, x, y },
      locals: { }
    })
  })

  it('should report variables from rendered templates with a bound variable and alias', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x | append: y }}' } })
    const template = engine.parse('{% render "a" with z as y %}') // z is aliased as y
    const analysis = analyzeSync(template)

    const x = [new Variable(['x'], { row: 1, col: 4, file: 'a' })]
    const y = [new Variable(['y'], { row: 1, col: 16, file: 'a' })]
    const z = [new Variable(['z'], { row: 1, col: 20, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { z, x, y },
      globals: { z, x },
      locals: { }
    })
  })

  it('should report variables from rendered templates using _for_ syntax', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x | append: y }}' } })
    const template = engine.parse('{% render "a" for z %}') // z is aliased as a
    const analysis = analyzeSync(template)

    const x = [new Variable(['x'], { row: 1, col: 4, file: 'a' })]
    const y = [new Variable(['y'], { row: 1, col: 16, file: 'a' })]
    const z = [new Variable(['z'], { row: 1, col: 19, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { z, x, y },
      globals: { z, x, y },
      locals: { }
    })
  })

  it('should report variables from rendered templates using _for_ syntax and an alias', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x | append: y }}' } })
    const template = engine.parse('{% render "a" for z as y %}') // z is aliased as y
    const analysis = analyzeSync(template)

    const x = [new Variable(['x'], { row: 1, col: 4, file: 'a' })]
    const y = [new Variable(['y'], { row: 1, col: 16, file: 'a' })]
    const z = [new Variable(['z'], { row: 1, col: 19, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { z, x, y },
      globals: { z, x },
      locals: { }
    })
  })

  it('should report variables from rendered templates with keyword arguments', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x | append: y }}' } })
    const template = engine.parse('{% render "a" x:y z:42 %}{{ x }}')
    const analysis = analyzeSync(template)

    const x = [
      new Variable(['x'], { row: 1, col: 4, file: 'a' }),
      new Variable(['x'], { row: 1, col: 29, file: undefined })
    ]

    const y = [
      new Variable(['y'], { row: 1, col: 17, file: undefined }),
      new Variable(['y'], { row: 1, col: 16, file: 'a' })
    ]

    expect(analysis).toStrictEqual({
      variables: { x, y },
      globals: { x: [x[1]], y },
      locals: { }
    })
  })

  it('should analyze rendered templates in an isolated scope', () => {
    const engine = new Liquid({ templates: { 'a': '{{ foo }}' } })
    const template = engine.parse('{% assign foo = "bar" %}{% render "a" %}{{ foo }}')
    const analysis = analyzeSync(template)

    expect(analysis).toStrictEqual({
      variables: { foo: [
        new Variable(['foo'], { row: 1, col: 4, file: 'a' }),
        new Variable(['foo'], { row: 1, col: 44, file: undefined })
      ] },
      globals: { foo: [new Variable(['foo'], { row: 1, col: 4, file: 'a' })] },
      locals: { foo: [new Variable(['foo'], { row: 1, col: 11, file: undefined })] }
    })
  })

  it('should report variables from layout templates', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x }}{% block %}{% endblock %}{{ y }}' } })
    const template = engine.parse('{% layout "a" %}{% block %}{{ z }}{% endblock %}')
    const analysis = analyzeSync(template)

    const x = [new Variable(['x'], { row: 1, col: 4, file: 'a' })]
    const y = [new Variable(['y'], { row: 1, col: 36, file: 'a' })]
    const z = [new Variable(['z'], { row: 1, col: 31, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { x, y, z },
      globals: { x, y, z },
      locals: { }
    })
  })

  it('should report variables outside block tags', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x }}{% block %}{% endblock %}{{ y }}' } })
    const template = engine.parse('{% layout "a" %}{{ b }}{% block %}{{ z }}{% endblock %}')
    const analysis = analyzeSync(template)

    const b = [new Variable(['b'], { row: 1, col: 20, file: undefined })]
    const x = [new Variable(['x'], { row: 1, col: 4, file: 'a' })]
    const y = [new Variable(['y'], { row: 1, col: 36, file: 'a' })]
    const z = [new Variable(['z'], { row: 1, col: 38, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { b, x, y, z },
      globals: { b, x, y, z },
      locals: { }
    })
  })

  it('should handle layout is none', () => {
    const engine = new Liquid()
    const template = engine.parse('{% layout none %}{% block %}{{ z }}{% endblock %}')
    const analysis = analyzeSync(template)

    const z = [new Variable(['z'], { row: 1, col: 32, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { z },
      globals: { z },
      locals: { }
    })
  })

  it('should handle block.super', () => {
    const engine = new Liquid({ templates: { 'a': '{{ x }}{% block %}{{ b }}{% endblock %}{{ y }}' } })
    const template = engine.parse('{% layout "a" %}{% block %}{{ z }}{{ block.super }}{% endblock %}')
    const analysis = analyzeSync(template)

    const b = [new Variable(['b'], { row: 1, col: 22, file: 'a' })]
    const x = [new Variable(['x'], { row: 1, col: 4, file: 'a' })]
    const y = [new Variable(['y'], { row: 1, col: 43, file: 'a' })]
    const z = [new Variable(['z'], { row: 1, col: 31, file: undefined })]
    const block = [new Variable(['block', 'super'], { row: 1, col: 38, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { b, x, y, z, block },
      globals: { b, x, y, z },
      locals: { }
    })
  })

  it('should handle recursive layout', () => {
    const engine = new Liquid({ templates: {
      'a': '{% layout "b" %}{% block %}{{ a }}{% endblock %}',
      'b': '{% layout "a" %}{% block %}{{ b }}{% endblock %}'
    } })
    const template = engine.parse('{% layout "a" %}{{ c }}')
    const analysis = analyzeSync(template)

    const a = [new Variable(['a'], { row: 1, col: 31, file: 'a' })]
    // const b = [new Variable(['b'], { row: 1, col: 31, file: 'b' })]
    const c = [new Variable(['c'], { row: 1, col: 20, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { a, c },
      globals: { a, c },
      locals: { }
    })
  })

  it('should ignore layouts with a dynamic name', () => {
    const engine = new Liquid()
    const template = engine.parse('{% layout a %}')
    const analysis = analyzeSync(template)

    const a = [new Variable(['a'], { row: 1, col: 11, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { a },
      globals: { a },
      locals: { }
    })
  })

  it('should report variables from layout keyword arguments', () => {
    const engine = new Liquid({ templates: { 'a': '{% block %}{{ x }}{% endblock %}' } })
    const template = engine.parse('{% layout "a" x:y %}')
    const analysis = analyzeSync(template)

    const x = [new Variable(['x'], { row: 1, col: 15, file: 'a' })]
    const y = [new Variable(['y'], { row: 1, col: 17, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { x, y },
      globals: { y },
      locals: { }
    })
  })
})
