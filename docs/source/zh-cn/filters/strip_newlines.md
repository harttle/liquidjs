---
title: strip_newlines
---

{% since %}v1.9.1{% endsince %}

移除字符串中的换行符。

输入
```liquid
{% capture string_with_newlines %}
Hello
there
{% endcapture %}

{{ string_with_newlines | strip_newlines }}
```

输出
```html

Hellothere
```
