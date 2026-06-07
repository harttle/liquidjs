---
title: raw
---

{% since %}v9.37.0{% endsince %}

Liquid filter that directly returns the value of the variable. Useful when [outputEscape](/api/interfaces/LiquidOptions.html#outputEscape) is set.

{% note info Auto escape %}
By default `outputEscape` is not set. That means LiquidJS output is not escaped by default, thus `raw` filter is not useful until `outputEscape` is set.
{% endnote %}

Input (`outputEscape` not set)
```liquid
{{ "<" }}
```

Output
```text
<
```

Input (`outputEscape="escape"`)
```liquid
{{ "<" }}
```

Output
```text
&lt;
```

Input (`outputEscape="json"`)
```liquid
{{ "<" }}
```

Output
```text
"<"
```

Input (`outputEscape="escape"`)
```liquid
{{ "<" | raw }}
```

Output
```text
<
```
