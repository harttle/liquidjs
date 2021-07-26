---
title: cycle
---

{% since %}v1.9.1{% endsince %}

循环一组字符串按照它们传入的顺序打印出来。每次调用 `cycle` 打印下一个参数。

## 基本使用

输入
```liquid
{% cycle "one", "two", "three" %}
{% cycle "one", "two", "three" %}
{% cycle "one", "two", "three" %}
{% cycle "one", "two", "three" %}
```

输出
```text
one
two
three
one
```

`cycle` 可以用于：

- 对表格里每一行按奇偶应用不同样式
- 对每行最后一项应用特殊样式

## 参数

一个模板中需要多个 `cycle` 时可以使用 "cycle 组" 参数。如果没有提供组名，使用同样参数调用的 `cycle` 会被认为处于同一组。

输入
```liquid
{% cycle "first": "one", "two", "three" %}
{% cycle "second": "one", "two", "three" %}
{% cycle "second": "one", "two", "three" %}
{% cycle "first": "one", "two", "three" %}
```

输出
```text
one
one
two
two
```
