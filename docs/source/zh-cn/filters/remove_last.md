---
title: remove_last
---

{% since %}v10.2.0{% endsince %}

移除字符串中出现的最后一个指定子字符串。

输入
```liquid
{{ "I strained to see the train through the rain" | remove_last: "rain" }}
```

输出
```text
I strained to see the train through the
```
