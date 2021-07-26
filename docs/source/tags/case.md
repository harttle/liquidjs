---
title: case
---

{% since %}v1.9.1{% endsince %}

Creates a switch statement to compare a variable with different values. `case` initializes the switch statement, and `when` compares its values.

Input
```liquid
{% assign handle = "cake" %}
{% case handle %}
  {% when "cake" %}
     This is a cake
  {% when "cookie", "biscuit" %}
     This is a cookie
  {% else %}
     This is not a cake nor a cookie
{% endcase %}
```

Output
```text
This is a cake
```
