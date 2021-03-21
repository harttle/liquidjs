---
title: Raw
---

{% since %}v1.9.1{% endsince %}

`raw` 标签可以暂时禁用 LiquidJS 的语法。生成和 Liquid 冲突的语言（比如 Nunjucks、Handlebars）时很有用。

输入
```liquid
{% raw %}
  In Handlebars, {{ this }} will be HTML-escaped, but
  {{{ that }}} will not.
{% endraw %}
```

输出
```text
In Handlebars, {{ this }} will be HTML-escaped, but {{{ that }}} will not.
```
