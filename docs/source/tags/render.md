---
title: Render
---

{% since %}v9.2.0{% endsince %}

## Basic Usage

### Render a Template

Renders a partial template from the template [root][root]s.

```liquid
{% render 'footer.liquid' %}
```

When the [extname][extname] option is set, the above `.liquid` extension can be omitted and writes:

```liquid
{% render 'footer' %}
```

{% note info Variable Scope %}
When a partial template is rendered, the code inside it can't access its parent's variables and its variables won't be accessible by its parent. This encapsulation helps make theme code easier to understand and maintain.{% endnote %}

### Passing Variables

Variables defined in parent's scope can be passed to a the partial template by listing them as parameters on the render tag:

```liquid
{% assign my_variable = 'apples' %}
{% render 'name', my_variable: my_variable, my_other_variable: 'oranges' %}
```

[globals][globals] don't need to be passed down. They are accessible from all files.

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
[globals]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-globals
