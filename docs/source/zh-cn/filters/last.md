---
title: last
---

{% since %}v1.9.1{% endsince %}

返回数组的最后一个元素。

输入
```liquid
{{ "Ground control to Major Tom." | split: " " | last }}
```

输出
```text
Tom.
```

输入
```liquid
{% assign my_array = "zebra, octopus, giraffe, tiger" | split: ", " %}
{{ my_array.last }}
```

输出
```text

tiger
```

需要在标签中使用的时候，可以用点来计算 `last`：

```liquid
{% if my_array.last == "tiger" %}
  There goes a tiger!
{% endif %}
```
