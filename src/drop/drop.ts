import { Context } from '../context'

export abstract class Drop {
  public liquidMethodMissing (key: string | number, context: Context): Promise<any> | any {
    return undefined
  }
}
