---
title: number_of_words
---

{% since %}v10.13.0{% endsince %}

计算文本中的单词数。此过滤器接受一个可选参数，用于控制输入字符串中汉字-日语-韩语（CJK）字符的处理方式：
- `'cjk'`：将每个检测到的 CJK 字符计为一个单词，无论是否由空格分隔。
- `'auto'`：与 `'cjk'` 类似，但如果过滤器用于可能包含或不包含 CJK 字符的字符串，则性能更好。

输入
```liquid
{{ "Hello world!" | number_of_words }}
```

输出
```text
2
```

输入
```liquid
{{ "你好hello世界world" | number_of_words }}
```

输出
```text
1
```

输入
```liquid
{{ "你好hello世界world" | number_of_words: "cjk" }}
```

输出
```text
6
```

输入
```liquid
{{ "你好hello世界world" | number_of_words: "auto" }}
```

输出
```text
6
```
