---
title: upcase
---

{% since %}v1.9.1{% endsince %}

字符串中每个字符都转为大写，对已经是大写的字符没有影响。

输入
```liquid
{{ "Parker Moore" | upcase }}
```

输出
```text
PARKER MOORE
```

输入
```liquid
{{ "APPLE" | upcase }}
```

输出
```text
APPLE
```
