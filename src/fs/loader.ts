import { FS } from './fs'

interface LoaderOptions {
  fs: FS;
  extname: string;
  root: string[];
  partials: string[];
  layouts: string[];
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

  public * lookup (file: string, type: LookupType, sync?: boolean) {
    const { fs } = this.options
    const dirs = this.options[type]
    for (const filepath of this.candidates(file, dirs)) {
      if (sync ? fs.existsSync(filepath) : yield fs.exists(filepath)) return filepath
    }
    throw this.lookupError(file, dirs)
  }

  private * candidates (file: string, dirs: string[]) {
    const { fs, extname } = this.options
    for (const dir of dirs) {
      yield fs.resolve(dir, file, extname)
    }
    if (fs.fallback !== undefined) {
      const filepath = fs.fallback(file)
      if (filepath !== undefined) yield filepath
    }
  }

  private lookupError (file: string, roots: string[]) {
    const err = new Error('ENOENT') as any
    err.message = `ENOENT: Failed to lookup "${file}" in "${roots}"`
    err.code = 'ENOENT'
    return err
  }
}
