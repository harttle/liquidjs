---
title: append
---

{% since %}v1.9.1{% endsince %}

Concatenates two strings and returns the concatenated value.

Input
```liquid
{{ "/my/fancy/url" | append: ".html" }}
```

Output
```text
/my/fancy/url.html
```

`append` can also be used with variables:

Input
```liquid
{% assign filename = "/index.html" %}
{{ "website.com" | append: filename }}
```

Output
```text

website.com/index.html
```
