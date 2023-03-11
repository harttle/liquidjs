import { createRequire } from 'module'

export function requireResolve (file) {
  /**
   * createRequire() can throw,
   * when import.meta.url not begin with "file://".
   */
  const require = createRequire(import.meta.url)
  return require.resolve(file)
}
