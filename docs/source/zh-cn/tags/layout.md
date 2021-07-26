---
title: Layout
---

{% since %}v1.9.1{% endsince %}

## 使用布局模板

套用模板 [根路径][root] 下的某个布局模板中。

```liquid
{% layout 'footer.liquid' %}
```

设置 [extname][extname] 选项为 `".liquid"` 后上面的 `.liquid` 后缀就可以省略了，等价于：

```liquid
{% layout 'footer' %}
```

通过 `layout` 渲染一个子模板时，它内部的代码可以访问父模板的变量，但父模板中不能访问它里面定义的变量。

## 变量传递

当前模板里定义的变量可以通过 `layout` 标签的参数列表传递给布局模板：

```liquid
{% assign my_variable = 'apples' %}
{% layout 'name', my_variable: my_variable, my_other_variable: 'oranges' %}
```

## 块

布局模板中可以包含若干 `block` 标签，这些 `block` 渲染时会按照子模板提供的内容进行填充。例如我们有布局模板 `default-layout.liquid`：

```
Header
{% block content %}My default content{% endblock %}
Footer
```

它被子模板 `page.liquid` 通过 `layout` 标签引用：

```
{% layout "default-layout" %}
{% block content %}My page content{% endblock %}
```

`page.liquid` 的渲染结果将会是：

```
Header
My page content
Footer
```

{% note tip 块 %}
<ul>
    <li>一个布局模板中可以定义多个块；</li>
    <li>如果只有一个块，它的名字可以省略。</li>
    <li>如果子模板未定义块的内容，将会使用父模板中提供的默认内容。</li>
</ul>
{% endnote %}

[extname]: ../../api/interfaces/liquid_options_.liquidoptions.html#Optional-extname
[root]: ../../api/interfaces/liquid_options_.liquidoptions.html#Optional-root
