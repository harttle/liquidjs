---
title: strip_newlines
---

{% since %}v1.9.1{% endsince %}

Removes any newline characters (line breaks) from a string.

Input
```liquid
{% capture string_with_newlines %}
Hello
there
{% endcapture %}

{{ string_with_newlines | strip_newlines }}
```

Output
```html

Hellothere
```
