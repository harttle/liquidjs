---
title: date_to_xmlschema
---
{% since %}v10.13.0{% endsince %}

Convert a Date into XML Schema (ISO 8601) format, same as Jekyll filter `date_to_xmlschema`.

Input
```liquid
{{ site.time | date_to_xmlschema }}
```

Output
```text
2008-11-07T13:07:54-08:00
```

Note that JavaScript `Date` has not timezone information, see [date][date] filter for details.

[date]: ./date.html
