---
title: concat
---

{% since %}v2.0.0{% endsince %}

连接多个数组，返回的数组包含所有传入数组的元素。

输入
```liquid
{% assign fruits = "apples, oranges, peaches" | split: ", " %}
{% assign vegetables = "carrots, turnips, potatoes" | split: ", " %}

{% assign everything = fruits | concat: vegetables %}

{% for item in everything %}
- {{ item }}
{% endfor %}
```

输出
```text
- apples
- oranges
- peaches
- carrots
- turnips
- potatoes
```

可以链式地使用 `concat` 过滤器来连接多个数组：

输入
```liquid
{% assign furniture = "chairs, tables, shelves" | split: ", " %}

{% assign everything = fruits | concat: vegetables | concat: furniture %}

{% for item in everything %}
- {{ item }}
{% endfor %}
```

输出
```text
- apples
- oranges
- peaches
- carrots
- turnips
- potatoes
- chairs
- tables
- shelves
```
