---
title: "#（单行注释）"
---

{% since %}v9.38.0{% endsince %}

在 Liquid 模板中添加注释，注释标签内的文字不会被输出。

输入
```liquid
注释标签内的东西都不会输出。
{% # this is an inline comment %}
但每行都必须以 '#' 开头。
{%
  # this is a comment
  # that spans multiple lines
%}
```

输出
```text
注释标签内的东西都不会输出。
但每行都必须以 '#' 开头。
```

在 <a href="./liquid.html">`liquid`</a> 标签里也可以使用注释标签。

```liquid
{% liquid
  # required args
  assign product = collection.products.first

  # optional args
  assign should_show_border = should_show_border | default: true
  assign should_highlight = should_highlight | default: false
%}
```

但注释标签不能用于把其他标签注释掉。这时应该使用 <a href="./comment.html">`comment`</a> 标签来临时禁用其他标签。

输入
```liquid
{%- # {% echo 'Welcome to LiquidJS!' %} -%}
{% comment %}{% echo 'Welcome to LiquidJS!' %}{% endcomment %}
```

输出
```text
 -%}
```
