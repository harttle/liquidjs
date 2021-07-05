---
title: Layout
---

{% since %}v1.9.1{% endsince %}

## Using a Layout Template

Renders current template inside a layout template from the template [roots][root].

```liquid
{% layout 'footer.liquid' %}
```

When the [extname][extname] option is set, the above `.liquid` extension can be omitted and writes:

```liquid
{% layout 'footer' %}
```

When a partial template is rendered by `layout`, the code inside it can access its caller's variables but its parent cannot access variables defined inside a included template.

## Passing Variables

Variables defined in current template can be passed to a the layout template by listing them as parameters on the `layout` tag:

```liquid
{% assign my_variable = 'apples' %}
{% layout 'name', my_variable: my_variable, my_other_variable: 'oranges' %}
```

## Blocks

The layout file can contain multiple `blocks` which will be populated by the child template (the caller). For example we have a `default-layout.liquid` file with the following contents:

```
Header
{% block content %}My default content{% endblock %}
Footer
```

And it's called by a `page.liquid` file with `layout` tag:

```
{% layout "default-layout" %}
{% block content %}My page content{% endblock %}
```

The render result of `page.liquid` will be :

```
Header
My page content
Footer
```

{% note tip Block %}
<ul>
    <li>Multiple blocks can be defined within a layout template;</li>
    <li>The block name is optional when there's only one block.</li>
    <li>The block contents will fallback to parent's corresponding block if not provided by child template.</li>
</ul>
{% endnote %}

[extname]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-extname
[root]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-root
