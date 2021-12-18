---
title: Include
---

{% since %}v1.9.1{% endsince %}

{% note warn Deprecated %}
This tag is deprecated, use <a href="./render.html">render</a> tag instead, which contains all the features of `include` and provides better encapsulation.
{% endnote %}

## Include a Template

Renders a partial template from the template [roots][root].

```liquid
{% include 'footer.liquid' %}
```

If [extname][extname] option is set, the above `.liquid` extension becomes optional:

```liquid
{% include 'footer' %}
```

When a partial template is rendered by `include`, the code inside it can access its parent's variables but its parent cannot access variables defined inside a included template.

## Passing Variables

Variables defined in parent's scope can be passed to a the partial template by listing them as parameters on the `include` tag:

```liquid
{% assign my_variable = 'apples' %}
{% include 'name', my_variable: my_variable, my_other_variable: 'oranges' %}
```

## The `with` Parameter

A single object can be passed to a snippet by using the `with...as` syntax:

```liquid
{% assign featured_product = all_products['product_handle'] %}
{% include 'product' with featured_product as product %}
```

In the example above, the `product` variable in the partial template will hold the value of `featured_product` in the parent template.

## Outputs & Filters

When filename is specified as literal string, it supports Liquid output and filter syntax. Useful when concatenating strings for a complex filename.

```liquid
{% include "prefix/{{name | append: \".html\"}}" %}
```

{% note info Escaping %}
In LiquidJS, `"` within quoted string literals need to be escaped. Adding a slash before the quote, e.g. `\"`. Using Jekyll-like filenames can make this easier, see below.
{% endnote %}

## Jekyll-like filenames

Setting [dynamicPartials][dynamicPartials] to `false` will enable Jekyll-like includes, file names are specified as literal string. And it also supports Liquid outputs and filters.

```liquid
{% include prefix/{{ page.my_variable }}/suffix %}
```

This way, you don't need to escape `"` in the filename expression.

```liquid
{% include prefix/{{name | append: ".html"}} %}
```

[extname]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-extname
[root]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-root
[dynamicPartials]: ../api/interfaces/liquid_options_.liquidoptions.html#dynamicPartials
