---
title: prepend
---

{% since %}v1.9.1{% endsince %}

在字符串开头添加另一个字符串。

输入
```liquid
{{ "apples, oranges, and bananas" | prepend: "Some fruit: " }}
```

输出
```text
Some fruit: apples, oranges, and bananas
```

`prepend` 也可以用于变量。

输入
```liquid
{% assign url = "example.com" %}
{{ "/index.html" | prepend: url }}
```

输出
```text

example.com/index.html
```
