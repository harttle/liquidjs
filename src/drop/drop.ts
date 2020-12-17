export abstract class Drop {
  public valueOf (): any {
    return undefined
  }

  public liquidMethodMissing (key: string): Promise<any | undefined> | any | undefined {
    return undefined
  }
}
