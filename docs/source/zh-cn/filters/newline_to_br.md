---
title: newline_to_br
---

{% since %}v1.9.1{% endsince %}

把字符串里的所有换行符（`\n`）替换为 HTML 换行（`<br />`）。

输入
```liquid
{% capture string_with_newlines %}
Hello
there
{% endcapture %}

{{ string_with_newlines | newline_to_br }}
```

输出
```html

<br/>Hello<br/>there<br/>
```
