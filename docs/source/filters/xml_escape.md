---
title: xml_escape
---

{% since %}v10.13.0{% endsince %}

Escape some text for use in XML.

Input
```liquid
{{ "Have you read \'James & the Giant Peach\'?" | xml_escape }}
```

Output
```text
Have you read &#39;James &amp; the Giant Peach&#39;?
```
