export abstract class Drop {
  public liquidMethodMissing (key: string | number): Promise<any> | any {
    return undefined
  }
}
