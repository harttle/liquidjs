import { LoaderOptions } from './loader'

export interface FS {
  /** check if a file exists asynchronously */
  exists: (filepath: string) => Promise<boolean>;
  /** check if a file exists synchronously */
  existsSync: (filepath: string) => boolean;
  /** read a file asynchronously */
  readFile: (filepath: string) => Promise<string>;
  /** read a file synchronously */
  readFileSync: (filepath: string) => string;
  /** resolve a file against directory, for given `ext` option */
  resolve: (dir: string, file: string, ext: string, options?: LoaderOptions) => string;
  /** defaults to "/", will be used for "within roots" check */
  sep?: string;
  /** dirname for a filepath, used when resolving relative path */
  dirname?: (file: string) => string;
  /** fallback file for lookup failure */
  fallback?: (file: string) => string | undefined;
}
