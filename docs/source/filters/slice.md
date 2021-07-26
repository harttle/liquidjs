---
title: slice
---

{% since %}v1.9.1{% endsince %}

Returns a substring of 1 character beginning at the index specified by the first argument. An optional second argument specifies the length of the substring to be returned.

String indices are numbered starting from 0.

Input
```liquid
{{ "Liquid" | slice: 0 }}
```

Output
```text
L
```

Input
```liquid
{{ "Liquid" | slice: 2 }}
```

Output
```text
q
```

Input
```liquid
{{ "Liquid" | slice: 2, 5 }}
```

Output
```text
quid
```

If the first argument is a negative number, the indices are counted from the end of the string:

Input
```liquid
{{ "Liquid" | slice: -3, 2 }}
```

Output
```text
ui
```
