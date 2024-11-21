import { Variable, VariableMap } from './analysis'

describe('Analysis variable', () => {
  const mockLocation = { row: 1, col: 1, file: undefined }

  it('should be a string object', () => {
    const v = new Variable(['foo', 'bar'], mockLocation)
    expect(v).toBeInstanceOf(String)
    expect(v.valueOf()).toBe('foo.bar')
  })

  it('should represent nested variables', () => {
    const nested = new Variable(['bar', 1], mockLocation)
    const v = new Variable(['foo', nested], mockLocation)
    expect(v.valueOf()).toBe('foo[bar[1]]')
  })

  it('should have a segments property', () => {
    const v = new Variable(['foo', 'bar'], mockLocation)
    expect(v.segments).toStrictEqual(['foo', 'bar'])
  })

  it('should have a location property', () => {
    const v = new Variable(['foo', 'bar'], mockLocation)
    expect(v.location).toStrictEqual(mockLocation)
  })
})

describe('Variable map', () => {
  it('should coerce variables to their string representation', () => {
    const v = new Variable(['foo', 'bar'], { row: 1, col: 1, file: undefined })
    const mapping = new VariableMap()
    mapping.push(v)
    expect(mapping.has(v)).toBe(true)
  })
})
