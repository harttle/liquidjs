---
title: size
---

{% since %}v1.9.1{% endsince %}

返回字符串的字符个数或者数组的元素个数。

输入
```liquid
{{ "Ground control to Major Tom." | size }}
```

输出
```text
28
```

输入
```liquid
{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}

{{ my_array.size }}
```

输出
```text


4
```

在标签里可以用点来计算 `size`：

```liquid
{% if site.pages.size > 10 %}
  This is a big website!
{% endif %}
```
