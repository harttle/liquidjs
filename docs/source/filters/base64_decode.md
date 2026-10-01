---
title: base64_decode
---

{% since %}v10.24.0{% endsince %}

Decodes a Base64-formatted string back to its original text.

Padding is optional and whitespace is ignored. Input that isn't valid Base64 renders an empty string, where Shopify/Liquid renders an error message in its place.

Input
```liquid
{{ "b25lIHR3byB0aHJlZQ==" | base64_decode }}
```

Output
```text
one two three
```

Input
```liquid
{{ "SGVsbG8sIFdvcmxkISBAIyQl" | base64_decode }}
```

Output
```text
Hello, World! @#$%
```