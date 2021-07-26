---
title: map
---

{% since %}v1.9.1{% endsince %}

按照属性名提取对象的属性形成另一个数组并返回。

下面的例子中假设 `site.pages` 包含了站点的所有网页元信息。使用 `assign` 加 `map` 过滤器创建了一个 `site.pages` 中所有对象的 `category` 属性的值构成的数组。

输入
```liquid
{% assign all_categories = site.pages | map: "category" %}

{% for item in all_categories %}
- {{ item }}
{% endfor %}
```

输出
```text
- business
- celebrities
- lifestyle
- sports
- technology
```
