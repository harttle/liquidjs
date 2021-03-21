---
title: url_decode
---

{% since %}v6.1.0{% endsince %}

把 URL 编码的字符串解码。

输入
```liquid
{{ "%27Stop%21%27+said+Fred" | url_decode }}
```

输出
```text
'Stop!' said Fred
```
