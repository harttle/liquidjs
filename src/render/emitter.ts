export interface Emitter {
  /**
   * Write a html value into emitter
   * @param html string, Drop or other primitive value
   */
  write (html: any): void;
  /**
   * Notify the emitter render has ended
   */
  end (): void;
  /**
   * Collect rendered string value immediately
   */
  collect (): string;
}
