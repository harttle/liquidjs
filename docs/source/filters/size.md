---
title: size
---

{% since %}v1.9.1{% endsince %}

Returns the number of characters in a string or the number of items in an array.

Input
```liquid
{{ "Ground control to Major Tom." | size }}
```

Output
```text
28
```

Input
```liquid
{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}

{{ my_array.size }}
```

Output
```text


4
```

You can use `size` with dot notation when you need to use the filter inside a tag:

```liquid
{% if site.pages.size > 10 %}
  This is a big website!
{% endif %}
```
