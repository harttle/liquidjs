---
title: downcase
---

{% since %}v1.9.1{% endsince %}

Makes each character in a string lowercase. It has no effect on strings which are already all lowercase.

Input
```liquid
{{ "Parker Moore" | downcase }}
```

Output
```text
parker moore
```

Input
```liquid
{{ "apple" | downcase }}
```

Output
```text
apple
```
