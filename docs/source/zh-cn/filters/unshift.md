---
title: unshift
---

{% since %}v10.11.0{% endsince %}

往数组头部添加一个元素。注意该操作不会改变原数组，而是在一份拷贝上操作。

输入
```liquid
{% assign fruits = "oranges, peaches" | split: ", " %}

{% assign everything = fruits | unshift: "apples" %}

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
