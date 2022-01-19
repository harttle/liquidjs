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
In LiquidJS, `"` within quoted string literals need to be escaped by adding a slash before the quote, e.g. `\"`. Using Jekyll-like filenames can make this easier, see below.
{% endnote %}

## Jekyll-like filenames

Setting [dynamicPartials][dynamicPartials] to `false` will enable Jekyll-like filenames, where file names are specified as literal string without surrounding quotes. Liquid outputs and filters are also supported within that, for example:

```liquid
{% include prefix/{{ page.my_variable }}/suffix %}
```

This way, you don't need to escape `"` in the filename expression.

```liquid
{% include prefix/{{name | append: ".html"}} %}
```

## Jekyll include

{% since %}v9.33.0{% endsince %}

[jekyllInclude][jekyllInclude] is used to enable Jekyll-like include syntax. Defaults to `false`, when set to `true`:

- Filename will be static: `dynamicPartials` now defaults to `false` (instead of `true`). And you can set `dynamicPartials` back to `true`.
- Use `=` instead of `:` to separate parameter key-values.
- Parameters are under `include` variable instead of current scope.

For example, the following template:

```liquid
{% include article.html header="HEADER" content="CONTENT" %}
```

`article.html` with following content:

```liquid
<article>
  <header>{{include.header}}</header>
  {{include.content}}
</article>
```

Note that we're referencing the first parameter by `include.header` instead of `header`. Will output following:

```html
<article>
  <header>HEADER</header>
  CONTENT
</article>
```

[extname]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-extname
[root]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-root
[dynamicPartials]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-dynamicPartials
[jekyllInclude]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-jekyllInclude
