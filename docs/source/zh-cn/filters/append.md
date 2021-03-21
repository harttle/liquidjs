---
title: append
---

{% since %}v1.9.1{% endsince %}

连接两个字符串并返回结果。

输入
```liquid
{{ "/my/fancy/url" | append: ".html" }}
```

输出
```text
/my/fancy/url.html
```

也可以用于变量。

输入
```liquid
{% assign filename = "/index.html" %}
{{ "website.com" | append: filename }}
```

输出
```text

website.com/index.html
```
