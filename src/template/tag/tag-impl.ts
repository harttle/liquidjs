import { Liquid } from '../../liquid'
import { TagImplOptions } from './tag-impl-options'

export interface TagImpl extends TagImplOptions {
  liquid: Liquid;
  [key: string]: any;
}
