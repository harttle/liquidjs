import { Context } from '../context/context'
import { Token } from '../tokens/token'
import { Emitter } from '../emitters/emitter'
import { IdentifierToken, QuotedToken, ValueToken } from '../tokens'
import { Value } from './value'

export type Argument = IdentifierToken | Value | ValueToken
export type Arguments = Iterable<Argument>
export type PartialScope = { name: string, isolated: boolean, scope: Iterable<string> }

export interface Template {
  token: Token;
  render(ctx: Context, emitter: Emitter): any;
  children?(partials: boolean): Iterable<Template>;
  arguments?(): Arguments;
  blockScope?(): Iterable<string>;
  localScope?(): Iterable<string | IdentifierToken | QuotedToken>;
  partialScope?(): PartialScope | undefined;
}
