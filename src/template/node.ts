import { Template } from '.'
import { ValueToken } from '../tokens'
import { Token } from '../tokens/token'
import { Value } from './value'

export interface MetaNode {
  token: Token;
  values: Array<Value | ValueToken>;
  children: Array<Template>;
  blockScope: string[];
  templateScope: string[];
}
