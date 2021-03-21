---
title: Include
---

{% since %}v1.9.1{% endsince %}

{% note warn Deprecated %}
This tag is deprecated, use <a href="./render.html">render</a> tag instead for better encapsulation.
{% endnote %}

## Include a Template

Renders a partial template from the template [roots][root].

```liquid
{% include 'footer.liquid' %}
```

When the [extname][extname] option is set, the above `.liquid` extension can be omitted and writes:

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

[extname]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-extname
[root]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-root
