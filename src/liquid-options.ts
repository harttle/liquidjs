import * as _ from './util/underscore'

export interface LiquidOptions {
  /** `root` is a directory or an array of directories to resolve layouts and includes, as well as the filename passed in when calling `.renderFile()`. If an array, the files are looked up in the order they occur in the array. Defaults to `["."]` */
  root?: string | string[]
  /** `extname` is used to lookup the template file when filepath doesn't include an extension name. Eg: setting to `".html"` will allow including file by basename. Defaults to `""`. */
  extname?: string
  /** `cache` indicates whether or not to cache resolved templates. Defaults to `false`. */
  cache?: boolean
  /** `dynamicPartials`: if set, treat `<filepath>` parameter in `{%include filepath %}`, `{%layout filepath%}` as a variable, otherwise as a literal value. Defaults to `true`. */
  dynamicPartials?: boolean
  /** `strictFilters` is used to enable strict filter existence. If set to `false`, undefined filters will be rendered as empty string. Otherwise, undefined filters will cause an exception. Defaults to `false`. */
  strictFilters?: boolean
  /** `strictVariables` is used to enable strict variable derivation.  If set to `false`, undefined variables will be rendered as empty string.  Otherwise, undefined variables will cause an exception. Defaults to `false`. */
  strictVariables?: boolean
  /** `trimTagRight` is used to strip blank characters (including ` `, `\t`, and `\r`) from the right of tags (`{% %}`) until `\n` (inclusive). Defaults to `false`. */
  trimTagRight?: boolean
  /** `trimTagLeft` is similar to `trimTagRight`, whereas the `\n` is exclusive. Defaults to `false`. See Whitespace Control for details. */
  trimTagLeft?: boolean
  /** ``trimOutputRight` is used to strip blank characters (including ` `, `\t`, and `\r`) from the right of values (`{{ }}`) until `\n` (inclusive). Defaults to `false`. */
  trimOutputRight?: boolean
  /** `trimOutputLeft` is similar to `trimOutputRight`, whereas the `\n` is exclusive. Defaults to `false`. See Whitespace Control for details. */
  trimOutputLeft?: boolean
  /** `tagDelimiterLeft` and `tagDelimiterRight` are used to override the delimiter for liquid tags **/
  tagDelimiterLeft?: string,
  tagDelimiterRight?: string,
  /** `outputDelimiterLeft` and `outputDelimiterRight` are used to override the delimiter for liquid outputs **/
  outputDelimiterLeft?: string,
  outputDelimiterRight?: string,
  /** `greedy` is used to specify whether `trim*Left`/`trim*Right` is greedy. When set to `true`, all consecutive blank characters including `\n` will be trimed regardless of line breaks. Defaults to `true`. */
  greedy?: boolean
}

interface NormalizedOptions extends LiquidOptions {
  root?: string[]
}

export interface NormalizedFullOptions extends NormalizedOptions {
  root: string[]
  extname: string
  cache: boolean
  dynamicPartials: boolean
  strictFilters: boolean
  strictVariables: boolean
  trimTagRight: boolean
  trimTagLeft: boolean
  trimOutputRight: boolean
  trimOutputLeft: boolean
  tagDelimiterLeft: string,
  tagDelimiterRight: string,
  outputDelimiterLeft: string,
  outputDelimiterRight: string,
  greedy: boolean
}

const defaultOptions: NormalizedFullOptions = {
  root: ['.'],
  cache: false,
  extname: '',
  dynamicPartials: true,
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
  strictVariables: false
}

export function normalize (options?: LiquidOptions): NormalizedOptions {
  options = options || {}
  if (options.hasOwnProperty('root')) {
    options.root = normalizeStringArray(options.root)
  }
  return options as NormalizedOptions
}

export function applyDefault (options?: NormalizedOptions): NormalizedFullOptions {
  return { ...defaultOptions, ...options }
}

function normalizeStringArray (value: any): string[] {
  if (_.isArray(value)) return value as string[]
  if (_.isString(value)) return [value as string]
  return []
}
