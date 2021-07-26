---
title: escape_once
---

{% since %}v1.9.1{% endsince %}

Escapes a string without changing existing escaped entities. It doesn't change strings that don't have anything to escape.

Input
```liquid
{{ "1 < 2 & 3" | escape_once }}
```

Output
<pre class="highlight">
{{"1 &lt; 2 &amp; 3" | escape}}
</pre>

Input
<pre class="highlight">
&#x7B;&#x7B; "{{"1 &lt; 2 &amp; 3" | escape}}" | escape_once }}
</pre>

Output
<pre class="highlight">
{{"1 &lt; 2 &amp; 3" | escape}}
</pre>
