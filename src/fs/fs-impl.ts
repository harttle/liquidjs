import { promisify } from '../util'
import { sep, resolve as nodeResolve, extname, dirname as nodeDirname } from 'path'
import { stat, statSync, readFile as nodeReadFile, readFileSync as nodeReadFileSync, realpath, realpathSync } from 'fs'
import { requireResolve } from './node-require'

type NodeReadFile = (file: string, encoding: string, cb: ((err: Error | null, result: string) => void)) => void
const statAsync = promisify(stat)
const readFileAsync = promisify<string, string, string>(nodeReadFile as NodeReadFile)

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
export function resolve (root: string, file: string, ext: string) {
  if (!extname(file)) file += ext
  return nodeResolve(root, file)
}
export function fallback (file: string) {
  try {
    return requireResolve(file)
  } catch (e) {}
}
export function dirname (filepath: string) {
  return nodeDirname(filepath)
}
const realpathAsync = promisify(realpath)

export async function contains (root: string, file: string) {
  try {
    const realRoot = await realpathAsync(root)
    const realFile = await realpathAsync(file)
    const prefix = realRoot.endsWith(sep) ? realRoot : realRoot + sep
    return realFile.startsWith(prefix)
  } catch {
    return false
  }
}
export function containsSync (root: string, file: string) {
  try {
    const realRoot = realpathSync(root)
    const realFile = realpathSync(file)
    const prefix = realRoot.endsWith(sep) ? realRoot : realRoot + sep
    return realFile.startsWith(prefix)
  } catch {
    return false
  }
}

export { sep } from 'path'
