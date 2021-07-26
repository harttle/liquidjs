---
title: escape
---

{% since %}v1.9.1{% endsince %}

Escapes a string by replacing HTML special characters with escape sequences. It doesn't change strings that don't have anything to escape.

Input
```liquid
{{ "Have you read 'James & the Giant Peach'?" | escape }}
```

Output
<pre class="highlight">
{{"Have you read &#39;James &amp; the Giant Peach&#39;?" | escape}}
</pre>

Input
```liquid
{{ "Tetsuro Takara" | escape }}
```

Output
```text
Tetsuro Takara
```
