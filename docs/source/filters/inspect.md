---
title: inspect
---

{% since %}v10.13.0{% endsince %}

Similar with `json`, but `inspect` allows cyclic structure. For the scope below:

```
const foo = {
    bar: 'BAR'
}
foo.foo = foo
const scope = { foo }
```

Input
```liquid
{% foo | inspect %}
```

Output
```text
{"bar":"BAR","foo":"[Circular]"}
```

## Formatting

An additional `space` argument can be specified for the indent width.

Input
```liquid
{{ foo | inspect: 4 }}
```

Output
```text
{
    "bar": "BAR",
    "foo": "[Circular]"
}
```
