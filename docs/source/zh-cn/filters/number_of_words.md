---
title: number_of_words
---

{% since %}v10.13.0{% endsince %}

计算文本中的单词数。此过滤器接受一个可选参数，用于控制输入字符串中汉字-日语-韩语（CJK）字符的处理方式：
- 将 'cjk' 作为参数传递将会将每个检测到的 CJK 字符计为一个单词，无论是否由空格分隔。
- 将 'auto' （自动检测）作为参数传递与 'cjk' 类似，但如果过滤器用于可能包含或不包含 CJK 字符的字符串，则性能更好。

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
