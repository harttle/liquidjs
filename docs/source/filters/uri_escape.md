---
title: uri_escape
---

{% since %}v10.13.0{% endsince %}

Percent encodes any special characters in a URI. URI escape normally replaces a space with `%20`. [Reserved characters][reserved] will not be escaped.

Input
```liquid
{{ "https://example.com/?q=foo, \bar?" | uri_escape }}
```

Output
```text
https://example.com/?q=foo,%20%5Cbar?
```

[reserved]: https://en.wikipedia.org/wiki/Percent-encoding#Types_of_URI_characters
