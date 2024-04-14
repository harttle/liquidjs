---
title: push
---

{% since %}v10.8.0{% endsince %}

在数组中添加一个元素。注意该操作不会改变原数组，而是在一份拷贝上操作。

输入
```liquid
{% assign fruits = "apples, oranges" | split: ", " %}

{% assign everything = fruits | push: "peaches" %}

{% for item in everything %}
- {{ item }}
{% endfor %}
```

输出
```text
- apples
- oranges
- peaches
```
