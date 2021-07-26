---
title: sort
---

{% since %}v1.9.1{% endsince %}

对数组中的元素排序，排序方式为 JavaScript `Array.prototype.sort()`。

输入
```liquid
{% assign my_array = "zebra, octopus, giraffe, Sally Snake" | split: ", " %}

{{ my_array | sort | join: ", " }}
```

输出
```text


Sally Snake, giraffe, octopus, zebra
```

有一个参数来指定用元素的哪个属性排序。

```liquid
{% assign products_by_price = collection.products | sort: "price" %}
{% for product in products_by_price %}
  <h4>{{ product.title }}</h4>
{% endfor %}
```
