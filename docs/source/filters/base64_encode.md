---
title: base64_encode
---

{% since %}v10.23.0{% endsince %}

Encodes a string into Base64 format.

Input
```liquid
{{ "one two three" | base64_encode }}
```

Output
```text
b25lIHR3byB0aHJlZQ==
```

Input
```liquid
{{ "Hello, World! @#$%" | base64_encode }}
```

Output
```text
SGVsbG8sIFdvcmxkISBAIyQl
```