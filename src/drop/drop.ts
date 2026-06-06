import { Context } from '../context'

export abstract class Drop {
  [key: string]: any
  public liquidMethodMissing (key: string | number, context: Context): Promise<any> | any {
    return undefined
  }
}
