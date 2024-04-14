---
title: 转义
---

LiquidJS 种转义有两种含义：

1. 输出语言的转义，即 HTML 转义。用来让输出的变量不包含 HTML 特殊字符，不影响 HTML 的结构，也就是输出 HTML 安全的字符串。
2. 语言自己的转义，即 Liquid 转义。用来输出包含对于 Liquid 语言来说是特殊字符的字符串，比如你在使用 Liquid 模板语言来编写一篇介绍 Liquid 语法的文章时就会需要 Liquid 转义。

## HTML 转义

默认情况下输出是不转义的，但你可以用 [escape][escape] 过滤器来做 HTML 转义：

输入
```liquid
{{ "1 < 2" | escape }}
```

输出
```text
1 &lt; 2
```

LiquidJS 也提供了其他过滤器来支持不同的转义需求：[escape_once][escape_once], [newline_to_br][newline_to_br], [strip_html][strip_html]。

当输出的变量不被信任时，可以把 [outputEscape][outputEscape] 参数设置为 `"escape"` 来启用默认 HTML 转义。这种情况下，如果你需要某个输出不被转义，则需要使用 [raw][raw] 过滤器：

输入
```liquid
{{ "1 < 2" }}
{{ "<button>OK</button>" | raw }}
```

输出
```text
1 &lt; 2
<button>OK</button>
```

## Liquid 转义

为了输出 Liquid 的特殊字符比如 `{{` 和 `{%`，你需要 [raw][raw] 标签。

输入
```liquid
{% raw %}
  In LiquidJS, {{ this | escape }} will be HTML-escaped, but
  {{{ that }}} will not.
{% endraw %}
```

输出
```text
In LiquidJS, {{ this | escape }} will be HTML-escaped, but
{{{ that }}} will not.
```

Within strings literals in LiquidJS template, `\` can be used to escape special characters in string syntax. For example:

输入
```liquid
{{ "\"" }}
```

输出
```liquid
"
```

[outputEscape]: ./options.html#outputEscape
[escape]: ../filters/escape.html
[raw]: ../filters/raw.html
[escape_once]: ../filters/escape.html
[strip_html]: ../filters/strip_html.html
[newline_to_br]: ../filters/newline_to_br.html
[raw]: ../tags/raw.html
