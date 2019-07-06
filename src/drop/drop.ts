export abstract class Drop {
  public valueOf (): any {
    return undefined
  }

  public liquidMethodMissing (key: string): Promise<string | undefined> | string | undefined {
    return undefined
  }
}
