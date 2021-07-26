---
title: case
---

{% since %}v1.9.1{% endsince %}

创建一个 switch 语句，把变量跟不同的值比较。`case` 创建 switch 语句，`when` 比较它的值。

输入
```liquid
{% assign handle = "cake" %}
{% case handle %}
  {% when "cake" %}
     This is a cake
  {% when "cookie", "biscuit" %}
     This is a cookie
  {% else %}
     This is not a cake nor a cookie
{% endcase %}
```

输出
```text
This is a cake
```
