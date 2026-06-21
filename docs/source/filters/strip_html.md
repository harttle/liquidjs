---
title: strip_html
---

{% since %}v1.9.1{% endsince %}

Removes any HTML tags from a string.

{% note warn Not safe for HTML output %}
This filter is **not** a sanitizer. Output may still contain `<` sequences (for example malformed tags without a closing `>`, same as [Shopify Liquid](https://shopify.dev/docs/api/liquid/filters/strip_html)). Do not write the result into HTML without also using [escape][escape], [escape_once][escape_once], or [`outputEscape: "escape"`][outputEscape].
{% endnote %}

Input
```liquid
{{ "Have <em>you</em> read <strong>Ulysses</strong>?" | strip_html }}
```

Output
```text
Have you read Ulysses?
```

[escape]: ./escape.html
[escape_once]: ./escape.html
[outputEscape]: ../tutorials/options.html#outputEscape
