import * as _ from './util/underscore.js'
import path from 'path'
import {anySeries} from './util/promise.js'
import {statFileAsync, readFileAsync} from './util/fs.js'

export async function resolve (filepath, root, options) {
  if (!path.extname(filepath)) {
    filepath += options.extname
  }
  root = options.root.concat(root || [])
  root = _.uniq(root)
  const paths = root.map(root => path.resolve(root, filepath))
  return anySeries(paths, async path => {
    try {
      await statFileAsync(path)
      return path
    } catch (e) {
      e.message = `${e.code}: Failed to lookup ${filepath} in: ${root}`
      throw e
    }
  })
}

export async function read (filepath) {
  return readFileAsync(filepath)
}
