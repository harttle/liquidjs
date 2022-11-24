import { FS } from './fs'
import { assert, escapeRegex } from '../util'

export interface LoaderOptions {
  fs: FS;
  extname: string;
  root: string[];
  partials: string[];
  layouts: string[];
  relativeReference: boolean;
}
export enum LookupType {
  Partials = 'partials',
  Layouts = 'layouts',
  Root = 'root'
}
export class Loader {
  public shouldLoadRelative: (referencedFile: string) => boolean
  private options: LoaderOptions
  private contains: (root: string, file: string) => boolean

  constructor (options: LoaderOptions) {
    this.options = options
    if (options.relativeReference) {
      const sep = options.fs.sep
      assert(sep, '`fs.sep` is required for relative reference')
      const rRelativePath = new RegExp(['.' + sep, '..' + sep, './', '../'].map(prefix => escapeRegex(prefix)).join('|'))
      this.shouldLoadRelative = (referencedFile: string) => rRelativePath.test(referencedFile)
    } else {
      this.shouldLoadRelative = (referencedFile: string) => false
    }
    this.contains = this.options.fs.contains || (() => true)
  }

  public * lookup (file: string, type: LookupType, sync?: boolean, currentFile?: string): Generator<unknown, string, string> {
    const { fs } = this.options
    const dirs = this.options[type]
    for (const filepath of this.candidates(file, dirs, currentFile, type !== LookupType.Root)) {
      if (sync ? fs.existsSync(filepath) : yield fs.exists(filepath)) return filepath
    }
    throw this.lookupError(file, dirs)
  }

  public * candidates (file: string, dirs: string[], currentFile?: string, enforceRoot?: boolean) {
    const { fs, extname } = this.options
    if (this.shouldLoadRelative(file) && currentFile) {
      const referenced = fs.resolve(this.dirname(currentFile), file, extname)
      for (const dir of dirs) {
        if (!enforceRoot || this.contains(dir, referenced)) {
          // the relatively referenced file is within one of root dirs
          yield referenced
          break
        }
      }
    }
    for (const dir of dirs) {
      const referenced = fs.resolve(dir, file, extname)
      if (!enforceRoot || this.contains(dir, referenced)) {
        yield referenced
      }
    }
    if (fs.fallback !== undefined) {
      const filepath = fs.fallback(file)
      if (filepath !== undefined) yield filepath
    }
  }

  private dirname (path: string) {
    const fs = this.options.fs
    assert(fs.dirname, '`fs.dirname` is required for relative reference')
    return fs.dirname!(path)
  }

  private lookupError (file: string, roots: string[]) {
    const err = new Error('ENOENT') as any
    err.message = `ENOENT: Failed to lookup "${file}" in "${roots}"`
    err.code = 'ENOENT'
    return err
  }
}
