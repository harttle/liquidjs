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
})
