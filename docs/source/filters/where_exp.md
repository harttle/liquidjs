---
title: where_exp
---

{% since %}v10.12.0{% endsince %}

Select all the objects in an array where the expression is true. In this example, assume you have a list of products and you want to show your kitchen products separately. Using `where_exp`, you can create an array containing only the products that have a `"type"` of `"kitchen"`.

Input
```liquid
All products:
{% for product in products %}
- {{ product.title }}
{% endfor %}

{% assign kitchen_products = products | where_exp: "item", "item.type == 'kitchen'" %}

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

[truthy]: ../tutorials/truthy-and-falsy.html
