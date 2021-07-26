---
title: remove_first
---

{% since %}v1.9.1{% endsince %}

移除字符串中出现的第一个指定子字符串。

输入
```liquid
{{ "I strained to see the train through the rain" | remove_first: "rain" }}
```

输出
```text
I strained to see the t through the rain
```
