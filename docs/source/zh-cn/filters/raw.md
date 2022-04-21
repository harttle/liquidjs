---
title: raw
---

{% since %}v9.37.0{% endsince %}

直接返回变量的值。配合 [outputEscape](/api/interfaces/liquid_options_.liquidoptions.html#Optional-outputEscape) 参数使用。

{% note info 自动转义 %}
默认情况下 `outputEscape` 为 `undefined`，这意味着 LiquidJS 输出不会默认转义，因此这时使用 `raw` 没有意义。
{% endnote %}

输入（未设置 `outputEscape`）
```liquid
{{ "<" }}
```

输出
```text
<
```

输入（`outputEscape="escape"`）
```liquid
{{ "<" }}
```

输出
```text
&lt;
```

输入（`outputEscape="json"`）
```liquid
{{ "<" }}
```

输出
```text
"<"
```

输入（`outputEscape="escape"`）
```liquid
{{ "<" | raw }}
```

输出
```text
<
```

