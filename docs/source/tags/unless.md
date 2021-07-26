---
title: Unless
---

{% since %}v1.9.1{% endsince %}

The opposite of `if` – executes a block of code only if a certain condition is **not** met.

Input
```liquid
{% unless product.title == "Awesome Shoes" %}
  These shoes are not awesome.
{% endunless %}
```

Output
```text
These shoes are not awesome.
```

This would be the equivalent of doing the following:

```liquid
{% if product.title != "Awesome Shoes" %}
  These shoes are not awesome.
{% endif %}
```
