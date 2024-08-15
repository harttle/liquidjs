const polyfill = {
  now: () => Date.now()
}

export const performance = typeof window === 'object' && window.performance || polyfill
