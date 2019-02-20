export interface LiquidOptions {
    /** `root` is a directory or an array of directories to resolve layouts and includes, as well as the filename passed in when calling `.renderFile()`. If an array, the files are looked up in the order they occur in the array. Defaults to `["."]` */
    root?: string | string[];
    /** `extname` is used to lookup the template file when filepath doesn't include an extension name. Eg: setting to `".html"` will allow including file by basename. Defaults to `""`. */
    extname?: string;
    /** `cache` indicates whether or not to cache resolved templates. Defaults to `false`. */
    cache?: boolean;
    /** `dynamicPartials`: if set, treat `<filepath>` parameter in `{%include filepath %}`, `{%layout filepath%}` as a variable, otherwise as a literal value. Defaults to `true`. */
    dynamicPartials?: boolean;
    /** `strict_filters` is used to enable strict filter existence. If set to `false`, undefined filters will be rendered as empty string. Otherwise, undefined filters will cause an exception. Defaults to `false`. */
    strict_filters?: boolean;
    /** `strict_variables` is used to enable strict variable derivation.  If set to `false`, undefined variables will be rendered as empty string.  Otherwise, undefined variables will cause an exception. Defaults to `false`. */
    strict_variables?: boolean;
    /** `trim_tag_right` is used to strip blank characters (including ` `, `\t`, and `\r`) from the right of tags (`{% %}`) until `\n` (inclusive). Defaults to `false`. */
    trim_tag_right?: boolean;
    /** `trim_tag_left` is similar to `trim_tag_right`, whereas the `\n` is exclusive. Defaults to `false`. See Whitespace Control for details. */
    trim_tag_left?: boolean;
    /** ``trim_output_right` is used to strip blank characters (including ` `, `\t`, and `\r`) from the right of values (`{{ }}`) until `\n` (inclusive). Defaults to `false`. */
    trim_output_right?: boolean;
    /** `trim_output_left` is similar to `trim_output_right`, whereas the `\n` is exclusive. Defaults to `false`. See Whitespace Control for details. */
    trim_output_left?: boolean;
    /** `tag_delimiter_left` and `tag_delimiter_right` are used to override the delimiter for liquid tags **/
    tag_delimiter_left?: string;
    tag_delimiter_right?: string;
    /** `output_delimiter_left` and `output_delimiter_right` are used to override the delimiter for liquid outputs **/
    output_delimiter_left?: string;
    output_delimiter_right?: string;
    /** `greedy` is used to specify whether `trim_left`/`trim_right` is greedy. When set to `true`, all consecutive blank characters including `\n` will be trimed regardless of line breaks. Defaults to `true`. */
    greedy?: boolean;
}
export interface NormalizedOptions extends LiquidOptions {
    root?: string[];
}
export interface NormalizedFullOptions extends NormalizedOptions {
    root: string[];
    extname: string;
    cache: boolean;
    dynamicPartials: boolean;
    strict_filters: boolean;
    strict_variables: boolean;
    trim_tag_right: boolean;
    trim_tag_left: boolean;
    trim_output_right: boolean;
    trim_output_left: boolean;
    greedy: boolean;
}
export declare function normalize(options: LiquidOptions): NormalizedOptions;
export declare function applyDefault(options: NormalizedOptions): NormalizedFullOptions;
