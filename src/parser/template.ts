import * as _ from '../util/underscore'
import * as path from 'path'
import { anySeries } from '../util/promise'
import { stat, readFile } from 'fs'

export const fs = {
  stat: _.promisify(stat) as ((filepath: string) => Promise<object>),
  readFile: _.promisify(readFile) as ((filepath: string, encoding: string) => Promise<string>)
}

export async function resolve (filepath, root, options) {
  if (!path.extname(filepath)) {
    filepath += options.extname
  }
  root = options.root.concat(root || [])
  root = _.uniq(root)
  const paths = root.map(root => path.resolve(root, filepath))
  return anySeries(paths, async path => {
    try {
      await fs.stat(path)
      return path
    } catch (e) {
      e.message = `${e.code}: Failed to lookup ${filepath} in: ${root}`
      throw e
    }
  })
}

export async function read (filepath): Promise<string> {
  return fs.readFile(filepath, 'utf8')
}
