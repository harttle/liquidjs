---
title: normalize_whitespace
---

{% since %}v10.13.0{% endsince %}

把连续的空白字符替换为单个空格。

输入
```liquid
{{ "a \n b" | normalize_whitespace }}
```

输出
```html
a b
```
