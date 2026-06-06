import { isNil } from '../util'

export class MapFS {
  constructor (private mapping: {[key: string]: string}) {}

  public sep = '/'

  async exists (filepath: string) {
    return this.existsSync(filepath)
  }

  existsSync (filepath: string) {
    return !isNil(this.mapping[filepath])
  }

  async readFile (filepath: string) {
    return this.readFileSync(filepath)
  }

  readFileSync (filepath: string) {
    const content = this.mapping[filepath]
    if (isNil(content)) throw new Error(`ENOENT: ${filepath}`)
    return content
  }

  async contains (root: string, filepath: string) {
    return this.containsSync(root, filepath)
  }

  containsSync (root: string, filepath: string) {
    if (root === '.' || root === '') return true
    const normalizedRoot = root.endsWith(this.sep) && root !== this.sep ? root.slice(0, -1) : root
    const prefix = normalizedRoot.endsWith(this.sep) ? normalizedRoot : normalizedRoot + this.sep
    return filepath === normalizedRoot || filepath.startsWith(prefix)
  }

  dirname (filepath: string) {
    const segments = filepath.split(this.sep)
    segments.pop()
    return segments.join(this.sep)
  }

  resolve (dir: string, file: string, ext: string) {
    file += ext
    if (dir === '.') return file
    const segments = dir.split(/\/+/)
    if (segments.length > 1 && segments[segments.length - 1] === '') segments.pop()
    for (const segment of file.split(this.sep)) {
      if (segment === '.' || segment === '') continue
      else if (segment === '..') {
        if (segments.length > 1 || segments[0] !== '') segments.pop()
      } else segments.push(segment)
    }
    return segments.join(this.sep)
  }
}
