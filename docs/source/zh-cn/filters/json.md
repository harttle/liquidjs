---
title: json
---

{% since %}v9.10.0{% endsince %}

通过 `JSON.stringify()` 把值转换为字符串，多用于调试用途。

输入
```liquid
{% assign arr = "foo bar coo" | split: " " %}
{{ arr | json }}
```

输出
```text
["foo","bar","coo"]
```

## 格式化

{% since %}v10.11.0{% endsince %}

可以指定一个 `space` 参数来格式化 JSON。

输入
```liquid
{% assign arr = "foo bar coo" | split: " " %}
{{ arr | json: 4 }}
```

输出
```text
[
    "foo",
    "bar",
    "coo"
]
```
