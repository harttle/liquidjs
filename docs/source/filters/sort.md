---
title: sort
---

{% since %}v1.9.1{% endsince %}

Sorts items in an array in case-sensitive order.

Input
```liquid
{% assign my_array = "zebra, octopus, giraffe, Sally Snake" | split: ", " %}

{{ my_array | sort | join: ", " }}
```

Output
```text


Sally Snake, giraffe, octopus, zebra
```

An optional argument specifies which property of the array's items to use for sorting.

```liquid
{% assign products_by_price = collection.products | sort: "price" %}
{% for product in products_by_price %}
  <h4>{{ product.title }}</h4>
{% endfor %}
```
