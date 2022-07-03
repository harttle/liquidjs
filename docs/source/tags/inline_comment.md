---
title: "# (inline comment)"
---

{% since %}v9.38.0{% endsince %}

Add comments to a Liquid template using an inline tag. Text enclosed in an inline comment tag will not be printed.

Input
```liquid
Anything inside an inline comment tag will not be printed.
{% # this is an inline comment %}
But every line must start with a '#'.
{%
  # this is a comment
  # that spans multiple lines
%}
```

Output
```text
Anything inside an inline comment tag will not be printed.
But every line must start with a '#'.
```

Inline comments are useful inside <a href="./liquid.html">`liquid`</a> tags too.

```liquid
{% liquid
  # required args
  assign product = collection.products.first

  # optional args
  assign should_show_border = should_show_border | default: true
  assign should_highlight = should_highlight | default: false
%}
```

But they don't work well for commenting out blocks of Liquid code. The <a href="./comment.html">`comment`</a> block tag is the better option when you need to temporarily stop other tags from being executed.

Input
```liquid
{%- # {% echo 'Welcome to LiquidJS!' %} -%}
{% comment %}{% echo 'Welcome to LiquidJS!' %}{% endcomment %}
```

Output
```text
 -%}
```
