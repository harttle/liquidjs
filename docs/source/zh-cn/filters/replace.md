---
title: replace
---

{% since %}v1.9.1{% endsince %}

把字符串中出现的每一个指定子字符串替换为另一个字符串。

输入
```liquid
{{ "Take my protein pills and put my helmet on" | replace: "my", "your" }}
```

输出
```text
Take your protein pills and put your helmet on
```
