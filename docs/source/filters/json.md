---
title: json
---

{% since %}v9.10.0{% endsince %}

Convert values to string via `JSON.stringify()`, for debug purpose.

Input
```liquid
{% assign arr = "foo bar coo" | split: " " %}
{{ arr | json }}
```

Output
```text
["foo","bar","coo"]
```

## Space

{% since %}v10.11.0{% endsince %}

An additional `space` parameter can be specified to format the JSON.

Input
```liquid
{% assign arr = "foo bar coo" | split: " " %}
{{ arr | json: 4 }}
```

Output
```text
[
    "foo",
    "bar",
    "coo"
]
```
