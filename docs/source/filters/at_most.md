---
title: at_most
---

Limits a number to a maximum value.

Input
```liquid
{{ 4 | at_most: 5 }}
```

Output
```text
4
```

Input
```liquid
{{ 4 | at_most: 3 }}
```

Output
```text
3
```
