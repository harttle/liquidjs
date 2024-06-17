---
title: uri_escape
---

{% since %}v10.13.0{% endsince %}

把 URI 中的特殊字符做百分号编码，空格会变成 `%20`。[保留字][reserved] 不会被转义。

输入
```liquid
{{ "https://example.com/?q=foo, \bar?" | uri_escape }}
```

输出
```text
https://example.com/?q=foo,%20%5Cbar?
```

[reserved]: https://en.wikipedia.org/wiki/Percent-encoding#Types_of_URI_characters
