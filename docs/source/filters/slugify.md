---
title: slugify
---

{% since %}v10.13.0{% endsince %}

Convert a string into a lowercase URL "slug". The slugify filter accepts 2 options:

1. `mode: string`. The default is `"default"`. They are as follows (with what they filter):
  - `"none"`: no characters
  - `"raw"`: spaces
  - `"default"`: spaces and non-alphanumeric characters
  - `"pretty"`: spaces and non-alphanumeric characters except for `._~!$&'()+,;=@`
  - `"ascii"`: spaces, non-alphanumeric, and non-ASCII characters
  - `"latin"`: like default, except Latin characters are first transliterated (e.g. àèïòü to aeiou).
2. `case: boolean`. The default is `false`. The original case of slug will be retained if set to `true`.

Input
```liquid
{{ "The _config.yml file" | slugify }}
```
Output
```
the-config-yml-file
```

Input
```liquid
{{ "The _config.yml file" | slugify: "pretty" }}
```
Output
```
the-_config.yml-file
```

Input
```liquid
{{ "The _cönfig.yml file" | slugify: "ascii" }}
```
Output
```
the-c-nfig-yml-file
```

Input
```liquid
{{ "The cönfig.yml file" | slugify: "latin" }}
```
Output
```
the-config-yml-file
```

Input
```liquid
{{ "The cönfig.yml file" | slugify: "latin", true }}
```
Output
```
The-config-yml-file
```
