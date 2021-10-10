import { FS } from './fs'

interface LoaderOptions {
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

  constructor (options: LoaderOptions) {
    this.options = options
  }

  public * lookup (file: string, type: LookupType, sync?: boolean, currentFile?: string) {
    const { fs } = this.options
    const dirs = this.options[type]
    for (const filepath of this.candidates(file, dirs, currentFile, type !== LookupType.Root)) {
      if (sync ? fs.existsSync(filepath) : yield fs.exists(filepath)) return filepath
    }
    throw this.lookupError(file, dirs)
  }

  public shouldLoadRelative (currentFile: string) {
    return this.options.relativeReference && this.isRelativePath(currentFile)
  }

  public isRelativePath (path: string) {
    return path.startsWith('./') || path.startsWith('../')
  }

  public * candidates (file: string, dirs: string[], currentFile?: string, enforceRoot?: boolean) {
    const { fs, extname } = this.options
    if (this.shouldLoadRelative(file) && currentFile) {
      const referenced = fs.resolve(this.dirname(currentFile), file, extname)
      for (const dir of dirs) {
        if (!enforceRoot || referenced.startsWith(dir)) {
          // the relatively referenced file is within one of root dirs
          yield referenced
          break
        }
      }
    }
    for (const dir of dirs) {
      const referenced = fs.resolve(dir, file, extname)
      if (!enforceRoot || referenced.startsWith(dir)) {
        yield referenced
      }
    }
    if (fs.fallback !== undefined) {
      const filepath = fs.fallback(file)
      if (filepath !== undefined) yield filepath
    }
  }

  private dirname (path: string) {
    const segments = path.split('/')
    segments.pop()
    return segments.join('/')
  }

  private lookupError (file: string, roots: string[]) {
    const err = new Error('ENOENT') as any
    err.message = `ENOENT: Failed to lookup "${file}" in "${roots}"`
    err.code = 'ENOENT'
    return err
  }
}
