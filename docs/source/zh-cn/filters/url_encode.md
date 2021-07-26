---
title: url_encode
---

{% since %}v1.9.1{% endsince %}

把字符串中 URL 不安全的字符转义为百分号编码。

输入
```liquid
{{ "john@liquid.com" | url_encode }}
```

输出
```text
john%40liquid.com
```

输入
```liquid
{{ "Tetsuro Takara" | url_encode }}
```

输出
```text
Tetsuro+Takara
```
