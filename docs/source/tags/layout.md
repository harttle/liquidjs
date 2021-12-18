---
title: Layout
---

{% since %}v1.9.1{% endsince %}

## Using a Layout

Introduce a layout template for the current template to render in. The directory for layout files are defined by [layouts][layouts] or [root][root].

```liquid
// default-layout.liquid
Header
{% block %}{% endblock %}
Footer

// page.liquid
{% layout "default-layout.liquid" %}
{% block %}My page content{% endblock %}

// result
Header
My page content
Footer
```

If [extname][extname] option is set, the `.liquid` extension becomes optional:

```liquid
{% layout 'default-layout' %}
```

{% note info Scoping %}
When a partial template is rendered by <code>layout</code>, its template have access for its caller's variables but not vice versa. Variables defined in layout will be popped out before control returning to its caller.
{% endnote %}

## Multiple Blocks

The layout file can contain multiple blocks, each with a specified name. The following snippets yield same result as in the above example.

```liquid
// default-layout.liquid
{% block header %}{% endblock %}
{% block content %}{% endblock %}
{% block footer %}{% endblock %}

// page.liquid
{% layout "default-layout.liquid" %}
{% block header %}Header{% endblock %}
{% block content %}My page content{% endblock %}
{% block footer %}Footer{% endblock %}
```

## Default Block Contents

In the above layout files, blocks has empty contents. But it's not necessarily be empty, in which case, the block contents in layout files will be used as default templates. The following snippets are also equivalent to the above examples:

```liquid
// default-layout.liquid
{% block header %}Header{% endblock %}
{% block content %}{% endblock %}
{% block footer %}Footer{% endblock %}

// page.liquid
{% layout "default-layout.liquid" %}
{% block content %}My page content{% endblock %}
```

## Passing Variables

Variables defined in current template can be passed to a the layout template by listing them as parameters on the `layout` tag:

```liquid
{% assign my_variable = 'apples' %}
{% layout 'name', my_variable: my_variable, my_other_variable: 'oranges' %}
```

## Outputs & Filters

When filename is specified as literal string, it supports Liquid output and filter syntax. Useful when concatenating strings for a complex filename.

```liquid
{% layout "prefix/{{name | append: \".html\"}}" %}
```

{% note info Escaping %}
In LiquidJS, `"` within quoted string literals need to be escaped. Adding a slash before the quote, e.g. `\"`. Using Jekyll-like filenames can make this easier, see below.
{% endnote %}

## Jekyll-like Filenames

Setting [dynamicPartials][dynamicPartials] to `false` will enable Jekyll-like filenames, file names are specified as literal string. And it also supports Liquid outputs and filters.

```liquid
{% layout prefix/{{ page.my_variable }}/suffix %}
```

This way, you don't need to escape `"` in the filename expression.

```liquid
{% layout prefix/{{name | append: ".html"}} %}
```

[extname]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-extname
[root]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-root
[layouts]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-layouts
[dynamicPartials]: ../api/interfaces/liquid_options_.liquidoptions.html#dynamicPartials
