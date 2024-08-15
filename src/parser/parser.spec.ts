import { Parser } from './parser'
import { Liquid, TokenKind } from '..'

describe('Parser', () => {
  it('should coerce input to string', () => {
    const parser = new Parser(new Liquid())
    const templates = parser.parse({} as any)
    expect(templates.length).toEqual(1)
    expect(templates[0]).toMatchObject({
      str: '[object Object]',
      token: {
        kind: TokenKind.HTML,
        input: '[object Object]',
        begin: 0,
        end: 15
      }
    })
  })
})
