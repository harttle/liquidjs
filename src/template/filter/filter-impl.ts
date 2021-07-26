import { Context } from '../../context/context'
import { Liquid } from '../../liquid'

export interface FilterImpl {
  context: Context;
  liquid: Liquid;
}
