---
title: reject_exp
---

{% since %}v10.21.0{% endsince %}

Select all the objects in an array where the expression is false. In this example, assume you have a list of products and you want to hide your kitchen products. Using `reject_exp`, you can create an array that omits only the products that have a `"type"` of `"kitchen"`.

Input
```liquid
All products:
{% for product in products %}
- {{ product.title }}
{% endfor %}

{% assign non_kitchen_products = products | reject_exp: "item", "item.type == 'kitchen'" %}

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

[truthy]: ../tutorials/truthy-and-falsy.html
