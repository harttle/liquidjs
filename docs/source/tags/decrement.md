---
title: Decrement
---

{% since %}v1.9.1{% endsince %}

Creates a new number variable, and decreases its value by one every time it is called. The first value is `-1`.

Input
```liquid
{% decrement variable %}
{% decrement variable %}
{% decrement variable %}
```

Output
```text
-1
-2
-3
```

Like [increment][increment], variables declared inside `decrement` are independent from variables created through [assign][assign] or [capture][capture].

[increment]: ./increment.html
[assign]: ./assign.html
[capture]: ./capture.html
