---
title: pop
---

{% since %}v10.11.0{% endsince %}

从数组末尾弹出一个元素。注意该操作不会改变原数组，而是在一份拷贝上操作。

输入
```liquid
{% assign fruits = "apples, oranges, peaches" | split: ", " %}

{% assign everything = fruits | pop %}

{% for item in everything %}
- {{ item }}
{% endfor %}
```

输出
```text
- apples
- oranges
```
