---
title: Partials and Layouts
---

## Render Partials

For the following template files:

```
// file: color.liquid
color: '{{ color }}' shape: '{{ shape }}'

// file: theme.liquid
{% assign shape = 'circle' %}
{% render 'color.liquid' %}
{% render 'color.liquid' with 'red' %}
{% render 'color.liquid', color: 'yellow', shape: 'square' %}
```

The output will be:

```
color: '' shape: 'circle'
color: 'red' shape: 'circle'
color: 'yellow' shape: 'square'
```

More details please refer to the [render](../tags/render.html) tag.

{% note tip The &quot;.liquid&quot; Extension %}
The ".liquid" extension in <code>layout</code>, <code>render</code> and <code>include</code> can be omitted if Liquid instance is created using `extname: ".liquid"` option. See <a href="./options.html#extname">the extname option</a> for details.
{% endnote %}

## Layout Templates (Extends)

For the following template files:

```
// file: default-layout.liquid
Header
{% block content %}My default content{% endblock %}
Footer

// file: page.liquid
{% layout "default-layout.liquid" %}
{% block content %}My page content{% endblock %}
```

The output of `page.liquid`:

```
Header
My page content
Footer
```

More details please refer to the [layout](../tags/layout.html) tag.
