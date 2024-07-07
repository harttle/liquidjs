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

  dirname (filepath: string) {
    const segments = filepath.split(this.sep)
    segments.pop()
    return segments.join(this.sep)
  }

  resolve (dir: string, file: string, ext: string) {
    file += ext
    if (dir === '.') return file
    const segments = dir.split(this.sep)
    for (const segment of file.split(this.sep)) {
      if (segment === '.' || segment === '') continue
      else if (segment === '..') segments.pop()
      else segments.push(segment)
    }
    return segments.join(this.sep)
  }
}
