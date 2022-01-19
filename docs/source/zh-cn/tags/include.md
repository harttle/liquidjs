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

## 输出和过滤器

文件名为字符串字面量时，支持 Liquid 输出和过滤器。在拼接文件名时很方便：

```liquid
{% include "prefix/{{name | append: \".html\"}}" %}
```

{% note info 转义 %}
字符串字面量里的 `"` 需要转义为 `\"`，使用静态文件名可以避免这个问题，见下面的 Jekyll-like 文件名。
{% endnote %}

## Jekyll-like 文件名

设置 [dynamicPartials][dynamicPartials] 为 `false` 来启用 Jekyll-like 文件名，这时文件名不需要用引号包含，会被当作字面量处理。 这样的字符串里面仍然支持 Liquid 输出和过滤器，例如：

```liquid
{% include prefix/{{ page.my_variable }}/suffix %}
```

这样文件名里的 `"` 就不用转义了。

```liquid
{% include prefix/{{name | append: ".html"}} %}
```

## Jekyll include

{% since %}v9.33.0{% endsince %}

[jekyllInclude][jekyllInclude] 用来启用 Jekyll-like include 语法。默认为 `false`，当设置为 `true` 时：

- 默认启用静态文件名：`dynamicPartials` 的默认值变为 `false`（而非 `true`）。但你也可以把它设置回 `true`。
- 参数的键和值之间由 `=` 分隔（本来是 `:`）。
- 参数放到了 `include` 变量下，而非当前作用域。

例如下面的模板：

```liquid
{% include article.html header="HEADER" content="CONTENT" %}
```

其中 `article.html` 的内容是：

```liquid
<article>
  <header>{{include.header}}</header>
  {{include.content}}
</article>
```

注意我们通过 `include.header` 引用第一个参数，而不是 `header`。输出如下：

```html
<article>
  <header>HEADER</header>
  CONTENT
</article>
```

[extname]: ../../api/interfaces/liquid_options_.liquidoptions.html#Optional-extname
[root]: ../../api/interfaces/liquid_options_.liquidoptions.html#Optional-root
[dynamicPartials]: ../../api/interfaces/liquid_options_.liquidoptions.html#Optional-dynamicPartials
[jekyllInclude]: ../../api/interfaces/liquid_options_.liquidoptions.html#Optional-jekyllInclude
