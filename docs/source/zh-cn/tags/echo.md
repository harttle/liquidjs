---
title: Echo
---

{% since %}v9.31.0{% endsince %}

根据表达式输出渲染 HTML。和使用 `{{` expression `}}` 包裹模板效果一样，不同的是 echo 可以在 liquid 标签中使用，同时也支持过滤器。

## echo

输入
```liquid
{% assign username = 'Bob' %}
{% echo username | append: ", welcome to LiquidJS!" | capitalize %}
```

输出
```text
Bob, welcome to LiquidJS!
```
