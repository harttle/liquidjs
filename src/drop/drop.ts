export abstract class Drop {
  public valueOf (): any {
    return undefined
  }

  public liquidMethodMissing (key: string): Promise<any | undefined> | string | undefined {
    return undefined
  }
}
