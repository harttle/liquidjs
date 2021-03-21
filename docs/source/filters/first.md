---
title: first
---

{% since %}v1.9.1{% endsince %}

Returns the first item of an array.

Input
```liquid
{{ "Ground control to Major Tom." | split: " " | first }}
```

Output
```text
Ground
```

Input
```liquid
{% assign my_array = "zebra, octopus, giraffe, tiger" | split: ", " %}
{{ my_array.first }}
```

Output
```text

zebra
```

You can use `first` with dot notation when you need to use the filter inside a tag:

```liquid
{% if my_array.first == "zebra" %}
  Here comes a zebra!
{% endif %}
```
