export abstract class Drop {
  public liquidMethodMissing (key: string | number): Promise<string | undefined> | string | undefined {
    return undefined
  }
}
