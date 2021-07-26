---
title: escape_once
---

{% since %}v1.9.1{% endsince %}

把字符串中的特殊字符转义得到可用在 URL 里的字符串，对已经转义过的字符串和不需要转义的字符串不会产生影响。

输入
```liquid
{{ "1 < 2 & 3" | escape_once }}
```

输出
<pre class="highlight">
{{"1 &lt; 2 &amp; 3" | escape}}
</pre>

输入
<pre class="highlight">
&#x7B;&#x7B; "{{"1 &lt; 2 &amp; 3" | escape}}" | escape_once }}
</pre>

输出
<pre class="highlight">
{{"1 &lt; 2 &amp; 3" | escape}}
</pre>
