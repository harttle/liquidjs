---
title: reject
---

{% since %}v10.21.0{% endsince %}

Creates an array excluding the objects with a given property value, or excluding [truthy][truthy] values by default when a property is not given.

In this example, assume you have a list of products and you want to filter out kitchen products. Using `reject`, you can create an array excluding only the products that have a `"type"` of `"kitchen"`.

Input
```liquid
All products:
{% for product in products %}
- {{ product.title }}
{% endfor %}

{% assign non_kitchen_products = products | reject: "type", "kitchen" %}

Kitchen products:
{% for product in non_kitchen_products %}
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
- Vacuum
- Television
```

Say instead you have a list of products and you want to exclude those which require taxable. You can `reject` with a property name but no target value to reject all products with a [truthy][truthy] `"taxable"` value.

Input
```liquid
All products:
{% for product in products %}
- {{ product.title }}
{% endfor %}

{% assign not_taxed_products = products | reject: "taxable" %}

Available products:
{% for product in not_taxed_products %}
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

Available products:
- Vacuum
- Television
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
{% assign selected = products | reject: 'meta.details["class"]', "B" %}
{% for item in selected -%}
- {{ item.order }}
{% endfor %}
```

Output
```text
- 1
```

## Jekyll style

{% since %}v10.21.0{% endsince %}

For Liquid users migrating from Jekyll, there's a `jekyllWhere` option to mimic the behavior of Jekyll's `where` filter. This option is set to `false` by default. When enabled, if `property` is an array, the target value is matched using `Array.includes` instead of `==`, which is particularly useful for filtering tags.

```javascript
const pages = [
    { tags: ["cat", "food"], title: 'Cat Food' },
    { tags: ["dog", "food"], title: 'Dog Food' },
]
```

Input
```liquid
{% assign selected = pages | where: 'tags', "cat" %}
{% for item in selected -%}
- {{ item.title }}
{% endfor %}
```

Output
```text
Cat Food
```

[truthy]: ../tutorials/truthy-and-falsy.html
