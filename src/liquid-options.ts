import { assert, isArray, isString, isFunction } from './util'
import { LRU, LiquidCache } from './cache'
import { FS } from './fs/fs'
import * as fs from './fs/node'
import { defaultOperators, Operators } from './render'
import { json } from './filters/misc'
import { escape } from './filters/html'

type OutputEscape = (value: any) => string
type OutputEscapeOption = 'escape' | 'json' | OutputEscape

export interface LiquidOptions {
  /** A directory or an array of directories from where to resolve layout and include templates, and the filename passed to `.renderFile()`. If it's an array, the files are looked up in the order they occur in the array. Defaults to `["."]` */
  root?: string | string[];
  /** A directory or an array of directories from where to resolve included templates. If it's an array, the files are looked up in the order they occur in the array. Defaults to `root` */
  partials?: string | string[];
  /** A directory or an array of directories from where to resolve layout templates. If it's an array, the files are looked up in the order they occur in the array. Defaults to `root` */
  layouts?: string | string[];
  /** Allow refer to layouts/partials by relative pathname. To avoid arbitrary filesystem read, paths been referenced also need to be within corresponding root, partials, layouts. Defaults to `true`. */
  relativeReference?: boolean;
  /** Use jekyll style include, pass parameters to `include` variable of current scope. Defaults to `false`. */
  jekyllInclude?: boolean;
  /** Add a extname (if filepath doesn't include one) before template file lookup. Eg: setting to `".html"` will allow including file by basename. Defaults to `""`. */
  extname?: string;
  /** Whether or not to cache resolved templates. Defaults to `false`. */
  cache?: boolean | number | LiquidCache;
  /** Use Javascript Truthiness. Defaults to `false`. */
  jsTruthy?: boolean;
  /** If set, treat the `filepath` parameter in `{%include filepath %}` and `{%layout filepath%}` as a variable, otherwise as a literal value. Defaults to `true`. */
  dynamicPartials?: boolean;
  /** Whether or not to assert filter existence. If set to `false`, undefined filters will be skipped. Otherwise, undefined filters will cause an exception. Defaults to `false`. */
  strictFilters?: boolean;
  /** Whether or not to assert variable existence.  If set to `false`, undefined variables will be rendered as empty string.  Otherwise, undefined variables will cause an exception. Defaults to `false`. */
  strictVariables?: boolean;
  /** Hide scope variables from prototypes, useful when you're passing a not sanitized object into LiquidJS or need to hide prototypes from templates. */
  ownPropertyOnly?: boolean;
  /** Modifies the behavior of `strictVariables`. If set, a single undefined variable will *not* cause an exception in the context of the `if`/`elsif`/`unless` tag and the `default` filter. Instead, it will evaluate to `false` and `null`, respectively. Irrelevant if `strictVariables` is not set. Defaults to `false`. **/
  lenientIf?: boolean;
  /** JavaScript timezone name or timezoneOffset for `date` filter, default to local time. That means if you're in Australia (UTC+10), it'll default to `-600` or `Australia/Lindeman` */
  timezoneOffset?: number | string;
  /** Strip blank characters (including ` `, `\t`, and `\r`) from the right of tags (`{% %}`) until `\n` (inclusive). Defaults to `false`. */
  trimTagRight?: boolean;
  /** Similar to `trimTagRight`, whereas the `\n` is exclusive. Defaults to `false`. See Whitespace Control for details. */
  trimTagLeft?: boolean;
  /** Strip blank characters (including ` `, `\t`, and `\r`) from the right of values (`{{ }}`) until `\n` (inclusive). Defaults to `false`. */
  trimOutputRight?: boolean;
  /** Similar to `trimOutputRight`, whereas the `\n` is exclusive. Defaults to `false`. See Whitespace Control for details. */
  trimOutputLeft?: boolean;
  /** The left delimiter for liquid tags. **/
  tagDelimiterLeft?: string;
  /** The right delimiter for liquid tags. **/
  tagDelimiterRight?: string;
  /** The left delimiter for liquid outputs. **/
  outputDelimiterLeft?: string;
  /** The right delimiter for liquid outputs. **/
  outputDelimiterRight?: string;
  /** Whether input strings to date filter preserve the given timezone **/
  preserveTimezones?: boolean;
  /** Whether `trim*Left`/`trim*Right` is greedy. When set to `true`, all consecutive blank characters including `\n` will be trimed regardless of line breaks. Defaults to `true`. */
  greedy?: boolean;
  /** `fs` is used to override the default file-system module with a custom implementation. */
  fs?: FS;
  /** the global scope passed down to all partial and layout templates, i.e. templates included by `include`, `layout` and `render` tags. */
  globals?: object;
  /** Whether or not to keep value type when writing the Output, not working for streamed rendering. Defaults to `false`. */
  keepOutputType?: boolean;
  /** Default escape filter applied to output values, when set, you'll have to add `| raw` for values don't need to be escaped. Defaults to `undefined`. */
  outputEscape?: OutputEscapeOption;
  /** An object of operators for conditional statements. Defaults to the regular Liquid operators. */
  operators?: Operators;
  /** Respect parameter order when using filters like "for ... reversed limit", Defaults to `false`. */
  orderedFilterParameters?: boolean;
}

export interface RenderOptions {
  /**
   * This call is sync or async? It's used by Liquid internal methods, you'll not need this.
   */
  sync?: boolean;
  /**
   * Same as `globals` on LiquidOptions, but only for current render() call
   */
  globals?: object;
  /**
   * Same as `strictVariables` on LiquidOptions, but only for current render() call
   */
  strictVariables?: boolean;
  /**
   * Same as `ownPropertyOnly` on LiquidOptions, but only for current render() call
   */
  ownPropertyOnly?: boolean;
}

interface NormalizedOptions extends LiquidOptions {
  root?: string[];
  partials?: string[];
  layouts?: string[];
  cache?: LiquidCache;
  outputEscape?: OutputEscape;
}

export interface NormalizedFullOptions extends NormalizedOptions {
  root: string[];
  partials: string[];
  layouts: string[];
  relativeReference: boolean;
  jekyllInclude: boolean;
  extname: string;
  cache?: LiquidCache;
  jsTruthy: boolean;
  dynamicPartials: boolean;
  fs: FS;
  strictFilters: boolean;
  strictVariables: boolean;
  ownPropertyOnly: boolean;
  lenientIf: boolean;
  trimTagRight: boolean;
  trimTagLeft: boolean;
  trimOutputRight: boolean;
  trimOutputLeft: boolean;
  tagDelimiterLeft: string;
  tagDelimiterRight: string;
  outputDelimiterLeft: string;
  outputDelimiterRight: string;
  preserveTimezones: boolean;
  greedy: boolean;
  globals: object;
  keepOutputType: boolean;
  operators: Operators;
}

export const defaultOptions: NormalizedFullOptions = {
  root: ['.'],
  layouts: ['.'],
  partials: ['.'],
  relativeReference: true,
  jekyllInclude: false,
  cache: undefined,
  extname: '',
  fs: fs,
  dynamicPartials: true,
  jsTruthy: false,
  trimTagRight: false,
  trimTagLeft: false,
  trimOutputRight: false,
  trimOutputLeft: false,
  greedy: true,
  tagDelimiterLeft: '{%',
  tagDelimiterRight: '%}',
  outputDelimiterLeft: '{{',
  outputDelimiterRight: '}}',
  preserveTimezones: false,
  strictFilters: false,
  strictVariables: false,
  ownPropertyOnly: true,
  lenientIf: false,
  globals: {},
  keepOutputType: false,
  operators: defaultOperators
}

export function normalize (options: LiquidOptions): NormalizedFullOptions {
  if (options.hasOwnProperty('root')) {
    if (!options.hasOwnProperty('partials')) options.partials = options.root
    if (!options.hasOwnProperty('layouts')) options.layouts = options.root
  }
  if (options.hasOwnProperty('cache')) {
    let cache: LiquidCache | undefined
    if (typeof options.cache === 'number') cache = options.cache > 0 ? new LRU(options.cache) : undefined
    else if (typeof options.cache === 'object') cache = options.cache
    else cache = options.cache ? new LRU(1024) : undefined
    options.cache = cache
  }
  options = { ...defaultOptions, ...(options.jekyllInclude ? { dynamicPartials: false } : {}), ...options }
  if (!options.fs!.dirname && options.relativeReference) {
    console.warn('[LiquidJS] `fs.dirname` is required for relativeReference, set relativeReference to `false` to suppress this warning, or provide implementation for `fs.dirname`')
    options.relativeReference = false
  }
  options.root = normalizeDirectoryList(options.root)
  options.partials = normalizeDirectoryList(options.partials)
  options.layouts = normalizeDirectoryList(options.layouts)
  options.outputEscape = options.outputEscape && getOutputEscapeFunction(options.outputEscape)
  return options as NormalizedFullOptions
}

function getOutputEscapeFunction (nameOrFunction: OutputEscapeOption): OutputEscape {
  if (nameOrFunction === 'escape') return escape
  if (nameOrFunction === 'json') return json
  assert(isFunction(nameOrFunction), '`outputEscape` need to be of type string or function')
  return nameOrFunction
}

export function normalizeDirectoryList (value: any): string[] {
  let list: string[] = []
  if (isArray(value)) list = value
  if (isString(value)) list = [value]
  return list
}
