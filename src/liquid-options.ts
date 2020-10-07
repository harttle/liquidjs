import * as _ from './util/underscore'
import { Template } from './template/template'
import { Cache } from './cache/cache'
import { LRU } from './cache/lru'
import { FS } from './fs/fs'

export interface LiquidOptions {
  /** A directory or an array of directories from where to resolve layout and include templates, and the filename passed to `.renderFile()`. If it's an array, the files are looked up in the order they occur in the array. Defaults to `["."]` */
  root?: string | string[];
  /** Add a extname (if filepath doesn't include one) before template file lookup. Eg: setting to `".html"` will allow including file by basename. Defaults to `""`. */
  extname?: string;
  /** Whether or not to cache resolved templates. Defaults to `false`. */
  cache?: boolean | number | Cache<Template[]>;
  /** Use Javascript Truthiness.Defaults to `false`. */
  jsTruthy?: boolean;
  /** If set, treat the `filepath` parameter in `{%include filepath %}` and `{%layout filepath%}` as a variable, otherwise as a literal value. Defaults to `true`. */
  dynamicPartials?: boolean;
  /** Whether or not to assert filter existence. If set to `false`, undefined filters will be skipped. Otherwise, undefined filters will cause an exception. Defaults to `false`. */
  strictFilters?: boolean;
  /** Whether or not to assert variable existence.  If set to `false`, undefined variables will be rendered as empty string.  Otherwise, undefined variables will cause an exception. Defaults to `false`. */
  strictVariables?: boolean;
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
  /** Whether `trim*Left`/`trim*Right` is greedy. When set to `true`, all consecutive blank characters including `\n` will be trimed regardless of line breaks. Defaults to `true`. */
  greedy?: boolean;
  /** `fs` is used to override the default file-system module with a custom implementation. */
  fs?: FS;
  /** the global environment passed down to all partial templates, i.e. templates included by `include`, `layout` and `render` tags. */
  globals?: object;
}

interface NormalizedOptions extends LiquidOptions {
  root?: string[];
  cache?: Cache<Template[]>;
}

export interface NormalizedFullOptions extends NormalizedOptions {
  root: string[];
  extname: string;
  cache: undefined | Cache<Template[]>;
  jsTruthy: boolean;
  dynamicPartials: boolean;
  strictFilters: boolean;
  strictVariables: boolean;
  trimTagRight: boolean;
  trimTagLeft: boolean;
  trimOutputRight: boolean;
  trimOutputLeft: boolean;
  tagDelimiterLeft: string;
  tagDelimiterRight: string;
  outputDelimiterLeft: string;
  outputDelimiterRight: string;
  greedy: boolean;
  globals: object;
}

export const defaultOptions: NormalizedFullOptions = {
  root: ['.'],
  cache: undefined,
  extname: '',
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
  strictFilters: false,
  strictVariables: false,
  globals: {}
}

export function normalize (options?: LiquidOptions): NormalizedOptions {
  options = options || {}
  if (options.hasOwnProperty('root')) {
    options.root = normalizeStringArray(options.root)
  }
  if (options.hasOwnProperty('cache')) {
    let cache: Cache<Template[]> | undefined
    if (typeof options.cache === 'number') cache = options.cache > 0 ? new LRU(options.cache) : undefined
    else if (typeof options.cache === 'object') cache = options.cache
    else cache = options.cache ? new LRU<Template[]>(1024) : undefined
    options.cache = cache
  }
  return options as NormalizedOptions
}

export function applyDefault (options: NormalizedOptions): NormalizedFullOptions {
  return { ...defaultOptions, ...options }
}

export function normalizeStringArray (value: any): string[] {
  if (_.isArray(value)) return value as string[]
  if (_.isString(value)) return [value as string]
  return []
}
