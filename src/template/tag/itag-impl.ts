import Liquid from '../../liquid'
import ITagImplOptions from './itag-impl-options'

export default interface ITagImpl extends ITagImplOptions {
  liquid: Liquid,
  [key: string]: any
}
