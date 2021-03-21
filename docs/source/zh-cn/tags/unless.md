---
title: Unless
---

{% since %}v1.9.1{% endsince %}

和 `if` 相反 —— 条件 **不满足** 时执行代码块。

输入
```liquid
{% unless product.title == "Awesome Shoes" %}
  These shoes are not awesome.
{% endunless %}
```

输出
```text
These shoes are not awesome.
```

等价于执行下面的代码：

```liquid
{% if product.title != "Awesome Shoes" %}
  These shoes are not awesome.
{% endif %}
```
