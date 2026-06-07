---
title: cgi_escape
---

{% since %}v10.13.0{% endsince %}

CGI escape a string for use in a URL. Replaces any special characters with appropriate `%XX` replacements. CGI escape normally replaces a space with a plus `+` sign.

Input
```liquid
{{ "foo, bar; baz?" | cgi_escape }}
```

Output
```text
foo%2C+bar%3B+baz%3F
```
