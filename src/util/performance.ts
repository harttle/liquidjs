interface LiquidPerformance {
  now: () => number
}

const polyfill: LiquidPerformance = {
  now: () => Date.now()
}

export function getPerformance (): LiquidPerformance {
  return (typeof global === 'object' && global.performance) ||
    (typeof window === 'object' && window.performance) ||
    polyfill
}
