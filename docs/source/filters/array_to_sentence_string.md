---
title: array_to_sentence_string
---

{% since %}v10.13.0{% endsince %}

Convert an array into a sentence. Useful for listing tags. Optional argument for connector.

Input
```liquid
{{ "foo,bar,baz" | split: "," | array_to_sentence_string }}
```

Output
```text
foo, bar, and baz
```

Input
```liquid
{{ "foo,bar,baz" | split: "," | array_to_sentence_string: "or" }}
```

Output
```text
foo, bar, or baz
```
