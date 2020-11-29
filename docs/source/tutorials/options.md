---
title: Options
---

The [Liquid][liquid] constructor accepts a plain object as options to define the behaviour of LiquidJS. All of these options are optional thus we can specify any of them, for example the `cache` option:

```javascript
const { Liquid } = require('liquidjs')
const engine = new Liquid({
    cache: true
})
```

{% note info API Document %}
Following is an overview for all the options, for exact types and signatures please refer to <a href="https://liquidjs.com/api/interfaces/liquid_options_.liquidoptions.html" target="_self">LiquidOptions | API</a>.
{% endnote %}

## cache

**cache** is used to improve performance by caching previously parsed template structures, specially in cases when we're repeatedly parse or render files.

It's default to `false`. When setting to `true` a default LRU cache of size 1024 will be enabled. And certainly it can be a number which indicates the size of cache you want.

Additionally, it can also be a custom cache implementation. See [Caching][caching] for details.

## dynamicPartials

**dynamicPartials** indicates whether or not to treat filename arguments in [include][include], [render][render], [layout][layout] tags as a variable. Defaults to `true`. For example, render the following snippet with scope `{ file: 'foo.html' }` will include the `foo.html`:

```liquid
{% include file %}
```

Setting `dynamicPartials: false`, LiquidJS will try to include the file named `file`, which is weird but allows simpler syntax if your template relations are static:

```liquid
{% liquid foo.html %}
```

{% note warn Common Pitfall %}
LiquidJS defaults this option to <code>true</code> to be compatible with shopify/liquid, but if you're from <a href="https://github.com/11ty/eleventy" target="_blank">eleventy</a> it's set to <code>false</code> by default (see <a href="https://www.11ty.dev/docs/languages/liquid/#quoted-include-paths" target="_blank">Quoted Include Paths</a>) which I believe is trying to be compatible with Jekyll.{% endnote %}

## extname

**extname** defines the default extname to be appended into filenames if the filename has no extname. Defaults to `''` which means it's disabled by default. By setting it to `.liquid`:

```liquid
{% render "foo" %}  there's no extname, adds `.liquid` and loads foo.liquid
{% render "foo.html" %}  there is an extname already, loads foo.html directly
```

{% note info Legacy Versions %}
Before 2.0.1, <code>extname</code> is set to `.liquid` by default. To change that you need to set <code>extname: ''</code> explicitly. See <a href="https://github.com/harttle/liquidjs/issues/41" target="_blank">#41</a> for details.
{% endnote %}

## root

**root** is used to specify template directories for LiquidJS to lookup and read template files. Can be a single string and an array of strings. See [Render Files][render-file] for details.

## fs

**fs** is used to define a custom file system implementation which will be used by LiquidJS to lookup and read template files. See [Abstract File System][abstract-fs] for details.

## globals

**globals** is used to define global variables available to all templates even in cases of [render tag][render]. See [3185][185] for details.

## jsTruthy

**jsTruthy** is used to use standard Javascript truthiness rather than the Shopify.

it defaults to false.  For example, when set to true, a blank string would evaluate to false with jsTruthy. With Shopify's truthiness, a blank string is true.

## Trimming

**greedy**, **trimOutputLeft**, **trimOutputRight**, **trimTagLeft**, **trimTagRight** options are used to eliminate extra newlines and indents in templates arround Liquid Constructs. See [Whitespace Control][wc] for details.

## Delimiter

**outputDelimiterLeft**, **outputDelimiterRight**, **tagDelimiterLeft**, **tagDelimiterRight** are used to customize the delimiters for LiquidJS [Tags and Filters][intro]. For example with `outputDelimiterLeft: <%=, outputDelimiterRight: %>` we are able to avoid conflicts with other languages:

```ejs
<%= username | append: ", welcome to LiquidJS!" %>
```

## Strict

**strictFilters** is used to assert filter existence. If set to `false`, undefined filters will be skipped. Otherwise, undefined filters will cause a parse exception. Defaults to `false`.

**strictVariables** is used to assert variable existence.  If set to `false`, undefined variables will be rendered as empty string.  Otherwise, undefined variables will cause a render exception. Defaults to `false`.

**lenientIf** modifies the behavior of `strictVariables` to allow handling optional variables. If set to `true`, an undefined variable will *not* cause an exception in the following two situations: a) it is the condition to an `if`, `elsif`, or `unless` tag; b) it occurs right before a `default` filter. Irrelevant if `strictVariables` is not set. Defaults to `false`.

{% note info Non-existent Tags %}
Non-existent tags always throw errors during pasrsing and this behaviour can not be customized.
{% endnote %}

[liquid]: ../api/classes/liquid_.liquid.html
[caching]: ./caching.html
[abstract-fs]: ./render-file.html#Abstract-File-System
[render-file]: ./render-file.html
[185]: https://github.com/harttle/liquidjs/issues/185
[render]: ../tags/render.html
[include]: ../tags/include.html
[layout]: ../tags/layout.html
[wc]: ./whitespace-control.html
[intro]: ./intro-to-liquid.html
