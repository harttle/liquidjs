---
title: Raw
---

{% since %}v1.9.1{% endsince %}

Raw temporarily disables tag processing. This is useful for generating content
(eg, Mustache, Handlebars) which uses conflicting syntax.

Input
```liquid
{% raw %}
  In Handlebars, {{ this }} will be HTML-escaped, but
  {{{ that }}} will not.
{% endraw %}
```

Output
```text
In Handlebars, {{ this }} will be HTML-escaped, but {{{ that }}} will not.
```
