---
title: xml_escape
---

{% since %}v10.13.0{% endsince %}

把文本做 XML 转义。

输入
```liquid
{{ "Have you read \'James & the Giant Peach\'?" | xml_escape }}
```

输出
```text
Have you read &#39;James &amp; the Giant Peach&#39;?
```
