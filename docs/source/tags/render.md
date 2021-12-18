---
title: Render
---

{% since %}v9.2.0{% endsince %}

## Render a Template

Render a partial template from partials directory specified by [partials][partials] or [root][root].

```liquid
// index.liquid
Contents
{% render 'footer.liquid' %}

// footer.liquid
Footer

// result
Contents
Footer
```

If [extname][extname] option is set, the above `.liquid` extension becomes optional:

```liquid
{% render 'footer' %}
```

{% note info Variable Scope %}
When a partial template is rendered, the code inside it can't access its parent's variables and its variables won't be accessible by its parent. This encapsulation makes partials easier to understand and maintain.{% endnote %}

## Passing Variables

Variables defined in parent's scope can be passed to a the partial template by listing them as parameters on the render tag:

```liquid
{% assign my_variable = 'apples' %}
{% render 'name', my_variable: my_variable, my_other_variable: 'oranges' %}
```

[globals][globals] don't need to be passed down. They are accessible from all files.

## Outputs & Filters

When filename is specified as literal string, it supports Liquid output and filter syntax. Useful when concatenating strings for a complex filename.

```liquid
{% render "prefix/{{name | append: \".html\"}}" %}
```

{% note info Escaping %}
In LiquidJS, `"` within quoted string literals need to be escaped. Adding a slash before the quote, e.g. `\"`. Using Jekyll-like filenames can make this easier, see below.
{% endnote %}

## Jekyll-like Filenames

Setting [dynamicPartials][dynamicPartials] to `false` will enable Jekyll-like filenames, file names are specified as literal string. And it also supports Liquid outputs and filters.

```liquid
{% render prefix/{{ page.my_variable }}/suffix %}
```

This way, you don't need to escape `"` in the filename expression.

```liquid
{% render prefix/{{name | append: ".html"}} %}
```

## Parameters

### The `with` Parameter

A single object can be passed to a snippet by using the `with...as` syntax:

```liquid
{% assign featured_product = all_products['product_handle'] %}
{% render 'product' with featured_product as product %}
```

In the example above, the `product` variable in the partial template will hold the value of `featured_product` in the parent template.

### The `for` Parameter

A partial template can be rendered once for each value of an enumerable by using the `for...as` syntax:

```liquid
{% assign variants = product.variants %}
{% render 'variant' for variants as variant %}
```

In the example above, the partial template will be rendered once for each `variant` of the `product`, and the `variant` variable will hold a product's variant object within the snippet.

{% note tip The forloop object %} When using the for parameter, the <a href="./for.html#forloop">forloop</a> object is accessible within the snippet.{% endnote %}

[forloop]: ./for.html
[extname]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-extname
[root]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-root
[partials]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-partials
[globals]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-globals
[dynamicPartials]: ../api/interfaces/liquid_options_.liquidoptions.html#dynamicPartials
