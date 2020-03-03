import * as _ from '../util/underscore'
import { resolve as nodeResolve, extname } from 'path'
import { stat, statSync, readFile as nodeReadFile, readFileSync as nodeReadFileSync } from 'fs'

const statAsync = _.promisify(stat)
const readFileAsync = _.promisify<string, string, string>(nodeReadFile)

export function exists (filepath: string) {
  return statAsync(filepath).then(() => true).catch(() => false)
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
export function resolve (root: string, file: string, ext: string) {
  if (!extname(file)) file += ext
  return nodeResolve(root, file)
}
export function fallback (file: string) {
  try {
    return require.resolve(file)
  } catch (e) {}
}
