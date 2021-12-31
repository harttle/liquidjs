---
title: The Liquid Template Language
---

LiquidJS is a simple, expressive and safe [Shopify][shopify/liquid] / Github Pages compatible template engine in pure JavaScript. The purpose of this repo is to provide a standard Liquid implementation for the JavaScript community. Liquid is originally implemented in Ruby and used by Github Pages, Jekyll and Shopify, see [Differences with Shopify/liquid][diff].

LiquidJS syntax is relatively simple. There're 2 types of markups in LiquidJS:

- **Tags**. A tag consists of a tag name and optional arguments wrapped between `{%raw%}{%{%endraw%}` and `%}`.
- **Outputs**. An output consists of a value and a list of filters, which is optional, wrapped between `{%raw%}{{{%endraw%}` and `}}`.

{% note info Live Demo %}
Before going into the details, here's a live demo to play around: <https://liquidjs.com/playground.html>.
{% endnote %}

## Outputs

**Outputs** are used to output variables, which can be transformed by filters, into HTML. The following template will insert the value of `username` into the input's value:

```liquid
<input type="text" name="user" value="{{username}}">
```

Values in output can be transformed by **filter**s before output. To append a string after the variable:

```liquid
{{ username | append: ", welcome to LiquidJS!" }}
```

Filters can be chained:

```liquid
{{ username | append: ", welcome to LiquidJS!" | capitalize }}
```

A complete list of filters supported by LiquidJS can be found [here](../filters/overview.html).

## Tags

**Tags** are used to control the template rendering process, manipulating template variables, inter-op with other templates, etc. For example `assign` can be used to define a variable which can be later used in the template:

```liquid
{% assign foo = "FOO" %}
```

Typically tags appear in pairs with a start tag and a corresponding end tag. For example:

```liquid
{% if foo == "FOO" %}
    Variable `foo` equals "FOO"
{% else %}
    Variable `foo` not equals "FOO"
{% endif %}
```

A complete list of tags supported by LiquidJS can be found [here](../tags/overview.html).

[shopify/liquid]: https://github.com/Shopify/liquid
[diff]: ./differences.html
