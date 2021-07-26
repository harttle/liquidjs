---
title: Assign
---

{% since %}v1.9.1{% endsince %}

创建一个新变量。

输入
```liquid
{% assign my_variable = false %}
{% if my_variable != true %}
  This statement is valid.
{% endif %}
```

输出
```text
This statement is valid.
```

用引号（`"`）包起来表示一个字符串。

输入
```liquid
{% assign foo = "bar" %}
{{ foo }}
```

输出
```text
bar
```
