declare function Liquid(): Liquid.LiquidEngine;

declare namespace Liquid {
  export interface LiquidEngine {
    private init(tag, filter, options): LiquidEngine
    private respectCache(key, getter): Promise<any>
    private evalValue: typeof Liquid.evalValue

    public parse(html: string, filepath: string): Liquid.Template
    public render(tpl: Template, ctx: any, opts: Options): Promise<string>
    public parseAndRender(html: string, ctx: any, opts: Options): Promise<string>
    public getTemplate(file: string, root: string): Promise<Liquid.Template>
    public renderFile(file: string, ctx: any, opts: Options): Promise<string>
    public registerFilter(name: string, filter: Filter): void
    public registerTag(name: string, tag: Tag): void
    public express(opts: Options): any
  }

  export interface Template { }
  export interface Options {
    /** `root` is a directory or an array of directories to resolve layouts and includes, as well as the filename passed in when calling `.renderFile()`. If an array, the files are looked up in the order they occur in the array. Defaults to `["."]`*/
    root: string | string[]
    /** `extname` is used to lookup the template file when filepath doesn't include an extension name. Eg: setting to `".html"` will allow including file by basename. Defaults to `""`. */
    extname: string
    /** `cache` indicates whether or not to cache resolved templates. Defaults to `false`. */
    cache: boolean
    /** `dynamicPartials`: if set, treat `<filepath>` parameter in `{%include filepath %}`, `{%layout filepath%}` as a variable, otherwise as a literal value. Defaults to `true`. */
    dynamicPartials: boolean
    /** `strict_filters` is used to enable strict filter existence. If set to `false`, undefined filters will be rendered as empty string. Otherwise, undefined filters will cause an exception. Defaults to `false`. */
    strict_filters: boolean
    /** `trim_tag_right` is used to strip blank characters (including ` `, `\t`, and `\r`) from the right of tags (`{% %}`) until `\n` (inclusive). Defaults to `false`. */
    trim_tag_right: boolean
    /** `trim_tag_left` is similiar to `trim_tag_right`, whereas the `\n` is exclusive. Defaults to `false`. See Whitespace Control for details. */
    trim_tag_left: boolean
    /** ``trim_value_right` is used to strip blank characters (including ` `, `\t`, and `\r`) from the right of values (`{{ }}`) until `\n` (inclusive). Defaults to `false`. */
    trim_value_right: boolean
    /** `trim_value_left` is similiar to `trim_value_right`, whereas the `\n` is exclusive. Defaults to `false`. See Whitespace Control for details. */
    trim_value_left: boolean
    /** `greedy` is used to specify whether `trim_left`/`trim_right` is greedy. When set to `true`, all consecutive blank characters including `\n` will be trimed regardless of line breaks. Defaults to `true`. */
    greedy: boolean
  }

  export interface Tag {
    // TODO: tokens type; this type
    parse(this: any, tagToken: any, remainTokens: any): void
    render(this: any, scope: any, hash: any): void
  }
  export type Filter = (...args?: any) => string

  export function isTruthy(val: any): boolean;
  export function isFalsy(val: any): boolean;
  export function evalExp(exp: string, scope: any): any;
  export function evalValue(str: string, scope: any): any;
  export const Types: Types;

  declare class LiquidError extends Error {
    public input: string
    public line: number
    public file: string
  }
  export class ParseError extends LiquidError {
    public originalError: Error
  }
  export class TokenizationError extends LiquidError { }
  export class RenderBreakError extends LiquidError { }
  export class AssertionError extends LiquidError { }

  export interface Types {
    ParseError: typeof ParseError,
    TokenizationError: typeof TokenizationError,
    RenderBreakError: typeof RenderBreakError,
    AssertionError: typeof AssertionError,
    AssignScope: any,
    CaptureScope: any,
    IncrementScope: any,
    DecrementScope: any
  }
}

export = Liquid;
export default Liquid;
