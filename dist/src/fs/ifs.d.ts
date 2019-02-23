export default interface IFS {
    exists: (filepath: string) => Promise<boolean>;
    readFile: (filepath: string) => Promise<string>;
    resolve: (root: string, file: string, ext: string) => string;
}
