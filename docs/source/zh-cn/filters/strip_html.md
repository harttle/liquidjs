---
title: strip_html
---

{% since %}v1.9.1{% endsince %}

移除字符串中的 HTML 标签。

输入
```liquid
{{ "Have <em>you</em> read <strong>Ulysses</strong>?" | strip_html }}
```

输出
```text
Have you read Ulysses?
```
