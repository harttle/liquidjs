import { createRequire } from 'module'

export function requireResolve (file) {
  const require = createRequire(process.cwd() + '/')
  return require.resolve(file)
}
