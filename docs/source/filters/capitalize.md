---
title: capitalize
---

Makes the first character of a string capitalized.

Input
```liquid
{{ "title" | capitalize }}
```

Output
```text
Title
```

`capitalize` only capitalizes the first character of a string, so later words are not affected:

 Input
```liquid
{{ "my great title" | capitalize }}
```

Output
```text
My great title
```
