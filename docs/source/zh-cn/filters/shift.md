---
title: shift
---

{% since %}v10.11.0{% endsince %}

从数组头部弹出一个元素。注意该操作不会改变原数组，而是在一份拷贝上操作。

输入
```liquid
{% assign fruits = "apples, oranges, peaches" | split: ", " %}

{% assign everything = fruits | shift %}

{% for item in everything %}
- {{ item }}
{% endfor %}
```

输出
```text
- oranges
- peaches
```
