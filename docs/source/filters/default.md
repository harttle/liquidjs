---
title: default
---

{% since %}v1.9.1{% endsince %}

Allows you to specify a fallback in case a value doesn't exist. `default` will show its value if the left side is [falsy][falsy] or empty (`string` or `Array`).

In this example, `product_price` is not defined, so the default value is used.

Input
```liquid
{{ product_price | default: 2.99 }}
```

Output
```text
2.99
```

In this example, `product_price` is defined, so the default value is not used.

Input
```liquid
{% assign product_price = 4.99 %}
{{ product_price | default: 2.99 }}
```

Output
```text
4.99
```

In this example, `product_price` is empty, so the default value is used.

Input
```liquid
{% assign product_price = "" %}
{{ product_price | default: 2.99 }}
```

Output
```text
2.99
```

[falsy]: ../tutorials/truthy-and-falsy.html
