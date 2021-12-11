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
  resolve: (dir: string, file: string, ext: string) => string;
  /** check if file is contained in `root`, always return `true` by default. Warning: not setting this could expose path traversal vulnerabilities. */
  contains?: (root: string, file: string) => boolean;
  /** defaults to "/" */
  sep?: string;
  /** required for relative path resolving */
  dirname?: (file: string) => string;
  /** fallback file for lookup failure */
  fallback?: (file: string) => string | undefined;
}
