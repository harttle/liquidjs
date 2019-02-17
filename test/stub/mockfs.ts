import { fs } from 'src/parser/template'
import { isString } from 'src/util/underscore'

const readFile = fs.readFile
const stat = fs.stat

type fileDescriptor = { mode: string, content: string }

export function mock (files: { [path: string]: (string | fileDescriptor) }) {
  for (const [key, val] of Object.entries(files)) {
    files[key] = isString(val)
      ? { mode: '33188', content: val as string }
      : val
  }
  fs.readFile = async function (path) {
    const file = files[path] as fileDescriptor
    if (file === undefined) throw new Error('ENOENT')
    if (file.mode === '000') throw new Error('EACCES')
    return file.content
  }
  fs.stat = async function (path) {
    const file = files[path] as fileDescriptor
    if (file === undefined) throw new Error('ENOENT')
    return file
  }
}

export function restore () {
  fs.readFile = readFile
  fs.stat = stat
}
