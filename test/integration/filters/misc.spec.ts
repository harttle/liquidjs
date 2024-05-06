import { Liquid } from '../../../src/liquid'

describe('filters/object', function () {
  const liquid = new Liquid()
  describe('default', function () {
    it('false should use default', async () => expect(await liquid.parseAndRender('{{false | default: "a"}}')).toBe('a'))
    it('empty string should use default', async () => expect(await liquid.parseAndRender('{{"" | default: "a"}}')).toBe('a'))
    it('empty array should use default', async () => expect(await liquid.parseAndRender('{{arr | default: "a"}}', { arr: [] })).toBe('a'))
    it('non-empty string should not use default', async () => expect(await liquid.parseAndRender('{{" " | default: "a"}}')).toBe(' '))
    it('nil should use default', async () => expect(await liquid.parseAndRender('{{nil | default: "a"}}')).toBe('a'))
    it('undefined should use default', async () => expect(await liquid.parseAndRender('{{not_defined | default: "a"}}')).toBe('a'))
    it('true should not use default', async () => expect(await liquid.parseAndRender('{{true | default: "a"}}')).toBe('true'))
    it('0 should not use default', async () => expect(await liquid.parseAndRender('{{0 | default: "a"}}')).toBe('0'))
    it('should output false when allow_false=true', async () => expect(await liquid.parseAndRender('{{false | default: true, allow_false: true}}')).toBe('false'))
    it('should output default without allow_false', async () => expect(await liquid.parseAndRender('{{false | default: true}}')).toBe('true'))
    it('should output default when allow_false=false', async () => expect(await liquid.parseAndRender('{{false | default: true, allow_false: false}}')).toBe('true'))
    it('should throw for additional args', () => {
      const src = `{{ age | default: 'now'  date: '%d'}}` // missing `|` before `date`
      return expect(liquid.parseAndRender(src)).rejects.toThrow(/unexpected character "date: '%d'"/)
    })
  })
  describe('json', function () {
    it('should stringify string', async () => expect(await liquid.parseAndRender('{{"foo" | json}}')).toBe('"foo"'))
    it('should stringify number', async () => expect(await liquid.parseAndRender('{{2 | json}}')).toBe('2'))
    it('should stringify object', async () => expect(await liquid.parseAndRender('{{obj | json}}', { obj: { foo: 'bar' } })).toBe('{"foo":"bar"}'))
    it('should stringify array', async () => expect(await liquid.parseAndRender('{{arr | json}}', { arr: [-2, 'a'] })).toBe('[-2,"a"]'))
    it('should support space', () => {
      const scope = { obj: { foo: 'foo', bar: 'bar' } }
      const result = '{\n    "foo": "foo",\n    "bar": "bar"\n}'
      expect(liquid.parseAndRenderSync('{{obj | json: 4}}', scope)).toBe(result)
    })
  })
  describe('jsonify', function () {
    it('should stringify string', async () => expect(await liquid.parseAndRender('{{"foo" | jsonify}}')).toBe('"foo"'))
  })
  describe('inspect', function () {
    it('should inspect string', async () => expect(await liquid.parseAndRender('{{"foo" | inspect}}')).toBe('"foo"'))
    it('should inspect object', () => {
      const text = '{{foo | inspect}}'
      const foo = { bar: 'bar' }
      const expected = '{"bar":"bar"}'
      return expect(liquid.parseAndRenderSync(text, { foo })).toBe(expected)
    })
    it('should inspect cyclic object', () => {
      const text = '{{foo | inspect}}'
      const foo: any = { bar: 'bar' }
      foo.foo = foo
      const expected = '{"bar":"bar","foo":"[Circular]"}'
      return expect(liquid.parseAndRenderSync(text, { foo })).toBe(expected)
    })
    it('should support space argument', () => {
      const text = '{{foo | inspect: 4}}'
      const foo: any = { bar: 'bar' }
      foo.foo = foo
      const expected = '{\n    "bar": "bar",\n    "foo": "[Circular]"\n}'
      return expect(liquid.parseAndRenderSync(text, { foo })).toBe(expected)
    })
  })
  describe('to_integer', function () {
    it('should stringify string', () => expect(liquid.parseAndRenderSync('{{ "123" | to_integer | json }}')).toBe('123'))
  })
})
