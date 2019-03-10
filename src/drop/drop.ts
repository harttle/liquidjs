export abstract class Drop {
  valueOf (): any {
    return undefined
  }

  liquidMethodMissing (key: string): Promise<string | undefined> | string | undefined {
    return undefined
  }
}
