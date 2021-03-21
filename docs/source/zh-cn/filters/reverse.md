---
title: reverse
---

{% since %}v1.9.1{% endsince %}

反转数组的所有元素，不可用于字符串。

输入
```liquid
{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}

{{ my_array | reverse | join: ", " }}
```

输出
```text


plums, peaches, oranges, apples
```

尽管 `reverse` 不能直接用于字符串，可以把字符串分割成数组，反转后再连接成字符串：

输入
```liquid
{{ "Ground control to Major Tom." | split: "" | reverse | join: "" }}
```

输出
```text
.moT rojaM ot lortnoc dnuorG
```
