import { deprecate } from '../util/deprecate'

export abstract class Drop {
  valueOf(): any {
    return undefined
  }

  liquidMethodMissing (key: string): string | undefined {
    return undefined
  }
}
