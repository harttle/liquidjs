import * as _ from '../util/underscore'
import { resolve as nodeResolve, extname, dirname as nodeDirname } from 'path'
import { stat, statSync, readFile as nodeReadFile, readFileSync as nodeReadFileSync } from 'fs'
import { LiquidOptions } from '../liquid-options'

const statAsync = _.promisify(stat)
const readFileAsync = _.promisify<string, string, string>(nodeReadFile)

export async function exists (filepath: string) {
  try {
    await statAsync(filepath)
    return true
  } catch (err) {
    return false
  }
}
export function readFile (filepath: string) {
  return readFileAsync(filepath, 'utf8')
}
export function existsSync (filepath: string) {
  try {
    statSync(filepath)
    return true
  } catch (err) {
    return false
  }
}
export function readFileSync (filepath: string) {
  return nodeReadFileSync(filepath, 'utf8')
}
export function resolve (root: string, file: string, ext: string, opts: LiquidOptions) {
  if (!extname(file)) file += ext
  return nodeResolve(root, file)
}
export function fallback (file: string) {
  try {
    return require.resolve(file)
  } catch (e) {}
}
export function dirname (filepath: string) {
  return nodeDirname(filepath)
}
export { sep } from 'path'
