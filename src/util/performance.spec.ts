import { getPerformance } from './performance'

describe('performance', () => {
  let globalPerformance: Performance
  beforeEach(() => {
    globalPerformance = global.performance
  })
  afterEach(() => {
    global.performance = globalPerformance
    delete (global as any).window
  })
  it('should use global.performance if exist', () => {
    const performance = {} as any as Performance
    global.performance = performance
    expect(getPerformance()).toEqual(performance)
  })
  it('should use window.performance if exist', () => {
    const performance = {} as any as Performance
    delete (global as any).performance
    global.window = { performance } as any
    expect(getPerformance()).toEqual(performance)
  })
  it('should use polyfill if no window/global.performance', () => {
    delete (global as any).performance
    const now = getPerformance().now()
    expect(Number.isInteger(now)).toBeTruthy()
  })
})
