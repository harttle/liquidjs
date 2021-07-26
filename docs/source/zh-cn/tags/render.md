---
title: Render
---

{% since %}v9.2.0{% endsince %}

## 基本使用

### 渲染一个模板

从模板 [根路径][root] 引入一个模板：

```liquid
{% render 'footer.liquid' %}
```

设置 [extname][extname] 选项为 `".liquid"` 后上面的 `.liquid` 后缀就可以省略了，等价于：

```liquid
{% render 'footer' %}
```

{% note info 变量作用域 %}
通过 `render` 渲染一个子模板时，它内部的代码不能访问父模板的变量，父模板中也不能访问它里面定义的变量。这个封装会让模板代码更容易理解和维护。{% endnote %}

### 变量传递

父模板里定义的变量可以通过 `render` 标签的参数列表传递给子模板：

```liquid
{% assign my_variable = 'apples' %}
{% render 'name', my_variable: my_variable, my_other_variable: 'oranges' %}
```

[全局变量][globals] 不需要传递，所有文件都可以访问它们。

## 参数

### `with` 参数

使用 `with...as` 语法可以给子模板传递一个变量：

```liquid
{% assign featured_product = all_products['product_handle'] %}
{% render 'product' with featured_product as product %}
```

上面的例子中，子模板中 `product` 会保有父模板中的 `featured_product` 变量的值。

### `for` 参数

用 `for...as` 语法可以对可枚举对象的每一个值渲染一次子模板：

```liquid
{% assign variants = product.variants %}
{% render 'variant' for variants as variant %}
```

上面的例子中，对 `product` 的每个 `variants` 是指都会渲染一次子模板。子模板中 `variant` 变量会保有父模板中的 `product.variants` 中对应元素的值。

{% note tip forloop 对象 %} 使用 for 参数时，在子模板中可以访问 <a href="./for.html#forloop">forloop</a> 对象。{% endnote %}

[extname]: ../../api/interfaces/liquid_options_.liquidoptions.html#Optional-extname
[root]: ../../api/interfaces/liquid_options_.liquidoptions.html#Optional-root
[globals]: ../../api/interfaces/liquid_options_.liquidoptions.html#Optional-globals
