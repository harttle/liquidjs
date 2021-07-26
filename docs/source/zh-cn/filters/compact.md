---
title: compact
---

{% since %}v9.22.0{% endsince %}

从数组里移除任何 `null` 和 `undefined` 值。

假设 `site.pages` 是网页列表，有些网页包含 `category` 属性用来标明类别。如果把它们 `map` 到数组里，那么对于没有 `category` 属性的元素就会是 `undefined`。

输入
```liquid
{% assign site_categories = site.pages | map: "category" %}

{% for category in site_categories %}
- {{ category }}
{% endfor %}
```

输出
```text
- business
- celebrities
-
- lifestyle
- sports
-
- technology
```

使用 `compact` 创建 `site_categories` 数组，可以移除所有 `null` 和 `undefined` 值。

输入
```liquid
{% assign site_categories = site.pages | map: "category" | compact %}

{% for category in site_categories %}
- {{ category }}
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
