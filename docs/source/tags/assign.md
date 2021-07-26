---
title: Assign
---

{% since %}v1.9.1{% endsince %}

Creates a new variable.

Input
```liquid
{% assign my_variable = false %}
{% if my_variable != true %}
  This statement is valid.
{% endif %}
```

Output
```text
This statement is valid.
```

Wrap a variable value in quotations `"` to save it as a string.

Input
```liquid
{% assign foo = "bar" %}
{{ foo }}
```

Output
```text
bar
```
