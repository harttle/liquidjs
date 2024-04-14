---
title: Escaping
---

Escaping is important in all languages, including LiquidJS. While escaping has 2 different meanings for a template engine:

1. Escaping for the output, i.e. HTML escape. Used to escape HTML special characters so the output will not break HTML structures, aka HTML safe.
2. Escaping for the language itself, i.e. Liquid escape. Used to output strings that's considered special in Liquid language. This will be useful when you're writing an article in Liquid template to introduce Liquid language.

## HTML Escape

By default output is not escaped. While you can use [escape][escape] filter for this:

Input
```liquid
{{ "1 < 2" | escape }}
```

Output
```text
1 &lt; 2
```

There's also [escape_once][escape_once], [newline_to_br][newline_to_br], [strip_html][strip_html] filters for you to fine tune your output.

In cases where variables are mostly not trusted, [outputEscape][outputEscape] can be set to `"escape"` to apply escape by default. In this case, when you need some output not to be escaped, [raw][raw] filter can be used:

Input
```liquid
{{ "1 < 2" }}
{{ "<button>OK</button>" | raw }}
```

Output
```text
1 &lt; 2
<button>OK</button>
```

## Liquid Escape

To disable Liquid language and output strings like `{{` and `{%`, the [raw][raw] tag can be used.

Input
```liquid
{% raw %}
  In LiquidJS, {{ this | escape }} will be HTML-escaped, but
  {{{ that }}} will not.
{% endraw %}
```

Output
```text
In LiquidJS, {{ this | escape }} will be HTML-escaped, but
{{{ that }}} will not.
```

Within strings literals in LiquidJS template, `\` can be used to escape special characters in string syntax. For example:

Input
```liquid
{{ "\"" }}
```

Output
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
