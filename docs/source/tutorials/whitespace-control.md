---
title: Whitespace Control
---

To keep source code neat and indented, we're adding spaces to our templates. LiquidJS offers whitespace control capabilities to eliminate these unwanted whitespaces in output HTML.

## via Markups

By default, all tags and output markups lines will generate a NL (`\n`), and whitespaces if there's any indentation. For example:

```liquid
{%  author = "harttle" %}
{{ author }}
```

Outputs (note the blank link):

```

harttle
```

We can include hyphens in your tag syntax (`{% raw %}{{-{% endraw %}`, `-}}`, `{% raw %}{%-{% endraw %}`, `-%}`) to strip whitespace from left or right. For example:

```liquid
{% assign author = "harttle" -%}
{{ author }}
```

Outputs:

```
harttle
```

In this case, the `-%}` strips the whitespace from the right side of the `assign` tag.

## via Options

Alternatively, LiquidJS provides these per engine options to enable whitespace control without sweeping changes of your templates:

* `trimTagLeft`
* `trimTagRight`
* `trimValueRight`
* `trimValueRight`

[LiquidJS][liquidjs] will **NOT** trim any whitespace by default, aka. above options all default to `false`. For details of these options, see the [options][options].

## Greedy Mode

In greedy mode (enabled by the [greedy option][greedy]), all consecutive whitespace chars (including `\n`) will be trimmed. Greedy mode is enabled by default to be compliant with [shopify/liquid][shopify/liquid].

[shopify/liquid]: https://github.com/Shopify/liquid
[liquidjs]: https://github.com/harttle/liquidjs
[options]: ../api/interfaces/liquid_options_.liquidoptions.html
[greedy]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-greedy