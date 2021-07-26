---
title: If
---

{% since %}v1.9.1{% endsince %}

条件为 `true` 时执行某个代码块。

## if

输入
```liquid
{% if product.title == "Awesome Shoes" %}
  These shoes are awesome!
{% endif %}
```

输出
```text
These shoes are awesome!
```

## elsif / else

在 `if` 或 [unless][unless] 块中添加更多的条件。

输入
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

输出
```text
Hey Anonymous!
```

[unless]: ./unless.html
