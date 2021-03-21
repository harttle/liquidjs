---
title: first
---

{% since %}v1.9.1{% endsince %}

返回数组的第一个元素。

输入
```liquid
{{ "Ground control to Major Tom." | split: " " | first }}
```

输出
```text
Ground
```

输入
```liquid
{% assign my_array = "zebra, octopus, giraffe, tiger" | split: ", " %}
{{ my_array.first }}
```

输出
```text

zebra
```

需要在标签中使用的时候，可以用点来计算 `first`：

```liquid
{% if my_array.first == "zebra" %}
  Here comes a zebra!
{% endif %}
```
