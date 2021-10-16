import { FS } from './fs'
import { escapeRegex } from '../util/underscore'
import { assert } from '../util/assert'

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
  private options: LoaderOptions
  private sep: string
  private rRelativePath: RegExp

  constructor (options: LoaderOptions) {
    this.options = options
    this.sep = this.options.fs.sep || '/'
    this.rRelativePath = new RegExp(['.' + this.sep, '..' + this.sep].map(prefix => escapeRegex(prefix)).join('|'))
  }

  public * lookup (file: string, type: LookupType, sync?: boolean, currentFile?: string) {
    const { fs } = this.options
    const dirs = this.options[type]
    for (const filepath of this.candidates(file, dirs, currentFile, type !== LookupType.Root)) {
      if (sync ? fs.existsSync(filepath) : yield fs.exists(filepath)) return filepath
    }
    throw this.lookupError(file, dirs)
  }

  public shouldLoadRelative (referencedFile: string) {
    return this.options.relativeReference && this.rRelativePath.test(referencedFile)
  }

  public * candidates (file: string, dirs: string[], currentFile?: string, enforceRoot?: boolean) {
    const { fs, extname } = this.options
    if (this.shouldLoadRelative(file) && currentFile) {
      const referenced = fs.resolve(this.dirname(currentFile), file, extname)
      for (const dir of dirs) {
        if (!enforceRoot || this.withinDir(referenced, dir)) {
          // the relatively referenced file is within one of root dirs
          yield referenced
          break
        }
      }
    }
    for (const dir of dirs) {
      const referenced = fs.resolve(dir, file, extname)
      if (!enforceRoot || this.withinDir(referenced, dir)) {
        yield referenced
      }
    }
    if (fs.fallback !== undefined) {
      const filepath = fs.fallback(file)
      if (filepath !== undefined) yield filepath
    }
  }

  private withinDir (file: string, dir: string) {
    dir = dir.endsWith(this.sep) ? dir : dir + this.sep
    return file.startsWith(dir)
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
