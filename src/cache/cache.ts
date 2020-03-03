export interface Cache<T> {
  write (key: string, value: T): void;
  read (key: string): T | undefined;
  has (key: string): boolean;
}
