---
title: cgi_escape
---

{% since %}v10.13.0{% endsince %}

把字符串 CGI 转义，用于 URL。用对应的 `%XX` 替换特殊字符，空格会被转义为 `+` 号。

输入
```liquid
{{ "foo, bar; baz?" | cgi_escape }}
```

输出
```text
foo%2C+bar%3B+baz%3F
```
