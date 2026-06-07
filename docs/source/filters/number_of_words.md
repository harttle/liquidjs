---
title: number_of_words
---

{% since %}v10.13.0{% endsince %}

Count the number of words in some text. This filter takes an optional argument to control the handling of Chinese-Japanese-Korean (CJK) characters in the input string:
- Passing `'cjk'` as the argument will count every CJK character detected as one word irrespective of being separated by whitespace.
- Passing `'auto'` (auto-detect) works similar to `'cjk'` but is more performant if the filter is used on a variable string that may or may not contain CJK chars.

Input
```liquid
{{ "Hello world!" | number_of_words }}
```

Output
```text
2
```

Input
```liquid
{{ "你好hello世界world" | number_of_words }}
```

Output
```text
1
```

Input
```liquid
{{ "你好hello世界world" | number_of_words: "cjk" }}
```

Output
```text
6
```

Input
```liquid
{{ "你好hello世界world" | number_of_words: "auto" }}
```

Output
```text
6
```
