export interface LiquidOptions {
  /** `root` is a directory or an array of directories to resolve layouts and includes, as well as the filename passed in when calling `.renderFile()`. If an array, the files are looked up in the order they occur in the array. Defaults to `["."]`*/
  root?: string | string[]
  /** `extname` is used to lookup the template file when filepath doesn't include an extension name. Eg: setting to `".html"` will allow including file by basename. Defaults to `""`. */
  extname?: string
  /** `cache` indicates whether or not to cache resolved templates. Defaults to `false`. */
  cache?: boolean
  /** `dynamicPartials`: if set, treat `<filepath>` parameter in `{%include filepath %}`, `{%layout filepath%}` as a variable, otherwise as a literal value. Defaults to `true`. */
  dynamicPartials?: boolean
  /** `strict_filters` is used to enable strict filter existence. If set to `false`, undefined filters will be rendered as empty string. Otherwise, undefined filters will cause an exception. Defaults to `false`. */
  strict_filters?: boolean
  /** `strict_variables` is used to enable strict variable derivation.  If set to `false`, undefined variables will be rendered as empty string.  Otherwise, undefined variables will cause an exception. Defaults to `false`. */
  strict_variables?: boolean
  /** `trim_tag_right` is used to strip blank characters (including ` `, `\t`, and `\r`) from the right of tags (`{% %}`) until `\n` (inclusive). Defaults to `false`. */
  trim_tag_right?: boolean
  /** `trim_tag_left` is similar to `trim_tag_right`, whereas the `\n` is exclusive. Defaults to `false`. See Whitespace Control for details. */
  trim_tag_left?: boolean
  /** ``trim_value_right` is used to strip blank characters (including ` `, `\t`, and `\r`) from the right of values (`{{ }}`) until `\n` (inclusive). Defaults to `false`. */
  trim_value_right?: boolean
  /** `trim_value_left` is similar to `trim_value_right`, whereas the `\n` is exclusive. Defaults to `false`. See Whitespace Control for details. */
  trim_value_left?: boolean
  /** `greedy` is used to specify whether `trim_left`/`trim_right` is greedy. When set to `true`, all consecutive blank characters including `\n` will be trimed regardless of line breaks. Defaults to `true`. */
  greedy?: boolean
}

export const defaultOptions: LiquidOptions = {
  root: ['.'],
  cache: false,
  extname: '',
  dynamicPartials: true,
  trim_tag_right: false,
  trim_tag_left: false,
  trim_value_right: false,
  trim_value_left: false,
  greedy: true,
  strict_filters: false,
  strict_variables: false
}
