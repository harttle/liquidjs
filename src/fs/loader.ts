import { FS } from './fs'
import { assert, LiquidAsync, toLiquidAsync } from '../util'

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
  private contains: LiquidAsync<NonNullable<FS['containsSync']>>
  private exists: LiquidAsync<FS['existsSync']>

  constructor (options: LoaderOptions) {
    this.options = options
    if (options.relativeReference) {
      const sep = options.fs.sep
      assert(sep, '`fs.sep` is required for relative reference')
      const prefixes = ['.' + sep, '..' + sep, './', '../']
      this.shouldLoadRelative = (referencedFile: string) => prefixes.some(prefix => referencedFile.startsWith(prefix))
    } else {
      this.shouldLoadRelative = (_referencedFile: string) => false
    }
    const fs = options.fs
    this.contains = toLiquidAsync(
      fs.contains?.bind(fs) || (async () => true),
      fs.containsSync?.bind(fs) || (() => true)
    )
    this.exists = toLiquidAsync(
      fs.exists?.bind(fs) || (async () => false),
      fs.existsSync?.bind(fs)
    )
  }

  public * lookup (file: string, type: LookupType, sync?: boolean, currentFile?: string): Generator<unknown, string, string> {
    const dirs = this.options[type]
    const enforceRoot = type !== LookupType.Root
    for (const filepath of this.candidates(file, dirs, currentFile)) {
      if (enforceRoot) {
        let allowed = false
        for (const dir of dirs) {
          if (yield this.contains(!!sync, dir, filepath)) { allowed = true; break }
        }
        if (!allowed) continue
      }
      if (yield this.exists(!!sync, filepath)) return filepath
    }
    throw this.lookupError(file, dirs)
  }

  public * candidates (file: string, dirs: string[], currentFile?: string) {
    const { fs, extname } = this.options

    if (this.shouldLoadRelative(file) && currentFile) {
      const referenced = fs.resolve(this.dirname(currentFile), file, extname)
      yield referenced
    }
    for (const dir of dirs) {
      const referenced = fs.resolve(dir, file, extname)
      yield referenced
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
