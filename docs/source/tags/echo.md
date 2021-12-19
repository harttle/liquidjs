---
title: Echo
---

{% since %}v9.31.0{% endsince %}

Outputs an expression in the rendered HTML. This is identical to wrapping an expression in `{{` and `}}`, but works inside liquid tags and supports filters.

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
