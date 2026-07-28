---
title: squish
---

{% since %}v10.28.0{% endsince %}

Removes leading and trailing whitespace from a string, and replaces every run of whitespace inside it with a single space.

Input
```liquid
{{ "  Hello   there,
    Major Tom.  " | squish }}
```

Output
```text
Hello there, Major Tom.
```
