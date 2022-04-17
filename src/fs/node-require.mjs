import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export const requireResolve = require.resolve
