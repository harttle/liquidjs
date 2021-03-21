---
title: Increment
---

{% since %}v1.9.1{% endsince %}

创建一个新的数字类型的变量，每次调用都把它的值加一。第一次为 `0`。

输入
```liquid
{% increment my_counter %}
{% increment my_counter %}
{% increment my_counter %}
```

输出
```text
0
1
2
```

在 `increment` 里声明的变量独立于 [assign][assign] 或 [capture][capture] 创建的变量。

下面的例子中通过 `assign` 创建了变量 `var`。然后用 `increment` 标签在同名变量上多次递增。注意 `increment` 标签不会影响 `assign` 创建的 `var` 的值。

输入
```liquid
{% assign var = 10 %}
{% increment var %}
{% increment var %}
{% increment var %}
{{ var }}
```

输出
```text
0
1
2
10
```

[assign]: ./assign.html
[capture]: ./capture.html
