---
title: capture
---

{% since %}v1.9.1{% endsince %}

把 `capture` 开闭标签之间的内容渲染后赋值给一个变量，这个变量的类型总是字符串。

输入
```liquid
{% capture my_variable %}I am being captured.{% endcapture %}
{{ my_variable }}
```

输出
```text
I am being captured.
```

在 `capture` 里可以使用 `assign` 创建的其他变量来构建复杂字符串：

输入
```liquid
{% assign favorite_food = "pizza" %}
{% assign age = 35 %}

{% capture about_me %}
I am {{ age }} and my favorite food is {{ favorite_food }}.
{% endcapture %}

{{ about_me }}
```

输出
```text
I am 35 and my favourite food is pizza.
```
