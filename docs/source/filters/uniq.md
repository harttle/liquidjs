---
title: uniq
---

{% since %}v1.9.1{% endsince %}

Removes any duplicate elements in an array.

Input
```liquid
{% assign my_array = "ants, bugs, bees, bugs, ants" | split: ", " %}
{{ my_array | uniq | join: ", " }}
```

Output
```text

ants, bugs, bees```
