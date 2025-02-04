---
title: where
---

{% since %}v8.1.0{% endsince %}

Creates an array including only the objects with a given property value, or any [truthy][truthy] value by default.

In this example, assume you have a list of products and you want to show your kitchen products separately. Using `where`, you can create an array containing only the products that have a `"type"` of `"kitchen"`.

Input
```liquid
All products:
{% for product in products %}
- {{ product.title }}
{% endfor %}

{% assign kitchen_products = products | where: "type", "kitchen" %}

Kitchen products:
{% for product in kitchen_products %}
- {{ product.title }}
{% endfor %}
```

Output
```text
All products:
- Vacuum
- Spatula
- Television
- Garlic press

Kitchen products:
- Spatula
- Garlic press
```

Say instead you have a list of products and you only want to show those that are available to buy. You can `where` with a property name but no target value to include all products with a [truthy][truthy] `"available"` value.

Input
```liquid
All products:
{% for product in products %}
- {{ product.title }}
{% endfor %}

{% assign available_products = products | where: "available" %}

Available products:
{% for product in available_products %}
- {{ product.title }}
{% endfor %}
```

Output
```text
All products:
- Coffee mug
- Limited edition sneakers
- Boring sneakers

Available products:
- Coffee mug
- Boring sneakers
```

Additionally, `property` can be any valid Liquid variable expression as used in output syntax, except that the scope of this expression is within each item. For the following `products` array:

```javascript
const products = [
    { meta: { details: { class: 'A' } }, order: 1 },
    { meta: { details: { class: 'B' } }, order: 2 },
    { meta: { details: { class: 'B' } }, order: 3 }
]
```

Input
```liquid
{% assign selected = products | where: 'meta.details["class"]', "B" %}
{% for item in selected -%}
- {{ item.order }}
{% endfor %}
```

Output
```text
- 2
- 3
```

## Jekyll style

{% since %}v10.21.0{% endsince %}

For Liquid users migrating from Jekyll, there's a `jekyllWhere` option to mimic the behavior of Jekyll's `where` filter. This option is set to `false` by default. When enabled, if `property` is an array, the target value is matched using `Array.includes` instead of `==`, which is particularly useful for excluding tags.

```javascript
const pages = [
    { tags: ["cat", "food"], title: 'Cat Food' },
    { tags: ["dog", "food"], title: 'Dog Food' },
]
```

Input
```liquid
{% assign selected = pages | reject: 'tags', "cat" %}
{% for item in selected -%}
- {{ item.title }}
{% endfor %}
```

Output
```text
Dog Food
```

[truthy]: ../tutorials/truthy-and-falsy.html
