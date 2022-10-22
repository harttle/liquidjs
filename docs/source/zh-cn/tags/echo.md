---
title: Echo
---

{% since %}v9.31.0{% endsince %}

根据表达式输出渲染HTML. 和使用`{{` expression `}}`包裹模板效果一样, 不同的是echo可以在liquid 标签中使用, 同时也支持过滤器

## echo

Input
```liquid
{% assign username = 'Bob' %}
{% echo username | append: ", welcome to LiquidJS!" | capitalize %}
```

Output
```text
Bob, welcome to LiquidJS!
```
