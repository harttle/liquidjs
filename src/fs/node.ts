import * as _ from '../util/underscore'
import { resolve, extname } from 'path'
import { stat, readFile } from 'fs'
import IFS from './ifs'

const statAsync = _.promisify(stat)
const readFileAsync = _.promisify<string, string, string>(readFile)

const fs: IFS = {
  exists: (filepath: string) => {
    return statAsync(filepath).then(() => true).catch(() => false)
  },
  readFile: filepath => {
    return readFileAsync(filepath, 'utf8')
  },
  resolve: (root: string, file: string, ext: string) => {
    if (!extname(file)) file += ext
    return resolve(root, file)
  }
}

export default fs
