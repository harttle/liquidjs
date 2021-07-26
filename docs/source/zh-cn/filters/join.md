---
title: join
---

{% since %}v1.9.1{% endsince %}

把数组中的元素连接成为一个字符串，以传入的参数作为分隔符。

输入
```liquid
{% assign beatles = "John, Paul, George, Ringo" | split: ", " %}
{{ beatles | join: " and " }}
```

输出
```text

John and Paul and George and Ringo
```
