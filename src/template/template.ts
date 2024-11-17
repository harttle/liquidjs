import { Context } from '../context/context'
import { Token } from '../tokens/token'
import { Emitter } from '../emitters/emitter'
import { ValueToken } from '../tokens'
import { Value } from './value'

export type Argument = string | Value | ValueToken
export type Arguments = Iterable<Argument>

export interface Template {
  token: Token;
  render(ctx: Context, emitter: Emitter): any;
  children?(): Iterable<Template>;
  arguments?(): Arguments;
  blockScope?(): Iterable<string>;
  localScope?(): Iterable<string>;
}
