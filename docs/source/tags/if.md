---
title: If
---

{% since %}v1.9.1{% endsince %}

Executes a block of code only if a certain condition is `true`.

## if

Input
```liquid
{% if product.title == "Awesome Shoes" %}
  These shoes are awesome!
{% endif %}
```

Output
```text
These shoes are awesome!
```

## elsif / else

Adds more conditions within an `if` or `unless` block.

Input
```liquid
<!-- If customer.name = "anonymous" -->
{% if customer.name == "kevin" %}
  Hey Kevin!
{% elsif customer.name == "anonymous" %}
  Hey Anonymous!
{% else %}
  Hi Stranger!
{% endif %}
```

Output
```text
Hey Anonymous!
```
