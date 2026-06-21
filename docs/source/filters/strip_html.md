---
title: strip_html
---

{% since %}v1.9.1{% endsince %}

Removes any HTML tags from a string.

{% note warn Not safe for HTML output %}
This filter removes tags by string scanning; it does not parse HTML5 the way a browser does, and it is not a sanitizer. The result may still be unsafe when inserted into HTML. Use [escape][escape], [escape_once][escape_once], or [`outputEscape: "escape"`][outputEscape] for untrusted output.
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
