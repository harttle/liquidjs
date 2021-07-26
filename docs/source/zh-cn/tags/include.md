---
title: Include
---

{% since %}v1.9.1{% endsince %}

{% note warn 已废弃 %}
这个标签已经废弃，请使用封装更好的 <a href="./render.html">render</a> 标签。
{% endnote %}

## 引入一个模板

从模板 [根路径][root] 引入一个模板：

```liquid
{% include 'footer.liquid' %}
```

设置 [extname][extname] 选项为 `".liquid"` 后上面的 `.liquid` 后缀就可以省略了，等价于：

```liquid
{% include 'footer' %}
```

通过 `include` 渲染一个子模板时，它内部的代码可以访问父模板的变量，但父模板中不能访问它里面定义的变量。

## 变量传递

父模板里定义的变量可以通过 `include` 标签的参数列表传递给子模板：

```liquid
{% assign my_variable = 'apples' %}
{% include 'name', my_variable: my_variable, my_other_variable: 'oranges' %}
```

## `with` 参数

使用 `with...as` 语法可以给子模板传递一个变量：

```liquid
{% assign featured_product = all_products['product_handle'] %}
{% include 'product' with featured_product as product %}
```

上面的例子中，子模板中 `product` 会保有父模板中的 `featured_product` 变量的值。

[extname]: ../../api/interfaces/liquid_options_.liquidoptions.html#Optional-extname
[root]: ../../api/interfaces/liquid_options_.liquidoptions.html#Optional-root
