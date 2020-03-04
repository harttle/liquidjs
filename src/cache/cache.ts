export interface Cache<T> {
  write (key: string, value: T): void | Promise<void>;
  read (key: string): T | undefined | Promise<T | undefined>;
}
