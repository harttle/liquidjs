export abstract class Drop {
  public liquidMethodMissing (key: string | number): Promise<any | undefined> | any | undefined {
    return undefined
  }
}
