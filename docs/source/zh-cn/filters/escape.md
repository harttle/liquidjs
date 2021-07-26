---
title: escape
---

{% since %}v1.9.1{% endsince %}

把字符串中的 HTML 特殊字符转义，对不需要转义的字符串不会产生影响。

输入
```liquid
{{ "Have you read 'James & the Giant Peach'?" | escape }}
```

输出
<pre class="highlight">
{{"Have you read &#39;James &amp; the Giant Peach&#39;?" | escape}}
</pre>

输入
```liquid
{{ "Tetsuro Takara" | escape }}
```

输出
```text
Tetsuro Takara
```
