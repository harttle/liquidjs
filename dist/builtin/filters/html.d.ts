declare function escape(str: string): string;
declare const _default: {
    'escape': typeof escape;
    'escape_once': (str: string) => string;
    'newline_to_br': (v: string) => string;
    'strip_html': (v: string) => string;
};
export default _default;
