export interface FS {
  exists: (filepath: string) => Promise<boolean>;
  readFile: (filepath: string) => Promise<string>;
  existsSync: (filepath: string) => boolean;
  readFileSync: (filepath: string) => string;
  resolve: (root: string, file: string, ext: string) => string;
  fallback?: (file: string) => string | undefined;
}
