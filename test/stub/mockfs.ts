import { isString, forOwn } from '../../src/util/underscore'
import fs from '../../src/fs/node'
import { resolve } from 'path'

interface FileDescriptor {
  mode: string;
  content: string;
}

let files: { [path: string]: FileDescriptor } = {}
const { readFile, exists, readFileSync, existsSync } = fs

export function mock (options: { [path: string]: (string | FileDescriptor) }) {
  forOwn(options, (val, key) => {
    files[resolve(key)] = isString(val)
      ? { mode: '33188', content: val }
      : val as FileDescriptor
  })
  fs.readFile = async function (path) {
    return fs.readFileSync(path)
  }
  fs.readFileSync = function (path) {
    const file = files[path]
    if (file === undefined) throw new Error('ENOENT')
    if (file.mode === '0000') throw new Error('EACCES')
    return file.content
  }
  fs.exists = async function (path: string) {
    return fs.existsSync(path)
  }
  fs.existsSync = function (path: string) {
    return !!files[path]
  }
}

export function restore () {
  files = {}
  fs.readFileSync = readFileSync
  fs.existsSync = existsSync
  fs.readFile = readFile
  fs.exists = exists
}
