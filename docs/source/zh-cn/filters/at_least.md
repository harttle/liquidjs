---
title: at_least
---

{% since %}v8.4.0{% endsince %}

限制数字到某个最小值。

输入
```liquid
{{ 4 | at_least: 5 }}
```

输出
```text
5
```

输入
```liquid
{{ 4 | at_least: 3 }}
```

输出
```text
4
```
