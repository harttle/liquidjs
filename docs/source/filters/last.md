---
title: last
---

{% since %}v1.9.1{% endsince %}

Returns the last item of an array.

Input
```liquid
{{ "Ground control to Major Tom." | split: " " | last }}
```

Output
```text
Tom.
```

Input
```liquid
{% assign my_array = "zebra, octopus, giraffe, tiger" | split: ", " %}
{{ my_array.last }}
```

Output
```text

tiger
```

You can use `last` with dot notation when you need to use the filter inside a tag:

```liquid
{% if my_array.last == "tiger" %}
  There goes a tiger!
{% endif %}
```
