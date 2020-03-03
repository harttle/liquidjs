import { isString, forOwn } from '../../src/util/underscore'
import * as fs from '../../src/fs/node'
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
  });
  (fs as any).readFile = async function (path: string) {
    return fs.readFileSync(path)
  };
  (fs as any).readFileSync = function (path: string) {
    const file = files[path]
    if (file === undefined) throw new Error('ENOENT')
    if (file.mode === '0000') throw new Error('EACCES')
    return file.content
  };
  (fs as any).exists = async function (path: string) {
    return fs.existsSync(path)
  };
  (fs as any).existsSync = function (path: string) {
    return !!files[path]
  }
}

export function restore () {
  files = {};
  (fs as any).readFileSync = readFileSync;
  (fs as any).existsSync = existsSync;
  (fs as any).readFile = readFile;
  (fs as any).exists = exists
}
