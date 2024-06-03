---
title: inspect
---

{% since %}v10.13.0{% endsince %}

类似于 `json`，但可以处理循环引用的情况。例如对于上下文：

```
const foo = {
    bar: 'BAR'
}
foo.foo = foo
const scope = { foo }
```

输入
```liquid
{% foo | inspect %}
```

输出
```text
{"bar":"BAR","foo":"[Circular]"}
```

## 格式化

可以指定一个 `space` 参数来缩进长度。

输入
```liquid
{{ foo | inspect: 4 }}
```

输出
```text
{
    "bar": "BAR",
    "foo": "[Circular]"
}
```
