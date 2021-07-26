---
title: Decrement
---

{% since %}v1.9.1{% endsince %}

创建一个新的数字类型的变量，每次调用都把它的值减一。第一次是 `-1`。

输入
```liquid
{% decrement variable %}
{% decrement variable %}
{% decrement variable %}
```

输出
```text
-1
-2
-3
```

像 [increment][increment] 一样，在 `decrement` 里声明的变量独立于 [assign][assign] 或 [capture][capture] 创建的变量。

[increment]: ./increment.html
[assign]: ./assign.html
[capture]: ./capture.html
