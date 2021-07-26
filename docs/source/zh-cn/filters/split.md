---
title: split
---

{% since %}v1.9.1{% endsince %}

把字符串按照指定的分隔符进行分割，`split` 通常用于把逗号分隔的字符串转换为数组。

输入
```liquid
{% assign beatles = "John, Paul, George, Ringo" | split: ", " %}

{% for member in beatles %}
  {{ member }}
{% endfor %}
```

输出
```text




  John

  Paul

  George

  Ringo
```
