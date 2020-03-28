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
{% render 'color' %}
{% render 'color' with 'red' %}
{% render 'color', color: 'yellow', shape: 'square' %}
```

The output will be:

```
color: '' shape: 'circle'
color: 'red' shape: 'circle'
color: 'yellow' shape: 'square'
```

More details please refer to the [render](../tags/render.html) tag.

## Layout Templates (Extends)

For the following template files:

```
// file: default-layout.liquid
Header
{% block content %}My default content{% endblock %}
Footer

// file: page.liquid
{% layout "default-layout" %}
{% block content %}My page content{% endblock %}
```

The output of `page.liquid`:

```
Header
My page content
Footer
```

More details please refer to the [layout](../tags/layout.html) tag.
