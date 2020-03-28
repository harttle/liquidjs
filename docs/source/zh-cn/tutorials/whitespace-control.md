---
title: 空白字符控制
---

为了让源代码缩进好看，我们会加很多空白字符比如把不会产生输出的标签也单独一行。LiquidJS 提供了空白字符控制机制，可以避免这些多余的空白字符输出到 HTML 中。

## 通过标记的方式

默认所有标签和输出的行，都会在行尾产生一个换行（`\n`），如果有缩进的话还会产生很多前导空格。例如：

```liquid
{%  author = "harttle" %}
{{ author }}
```

将会输出（注意前面的空行）：

```

harttle
```

可以在标签和输出的标记里面加横线（`{% raw %}{{-{% endraw %}`, `-}}`, `{% raw %}{%-{% endraw %}`, `-%}`）来移除左侧/右侧的空白。例如：

```liquid
{% assign author = "harttle" -%}
{{ author }}
```

将会输出：

```
harttle
```

这个例子中 `-%}` 移除了 `assign` 标签右侧的空白。

## 通过选项

此外 LiquidJS 还提供了一系列选项来帮助扫代码式地移除空白：

* `trimTagLeft`
* `trimTagRight`
* `trimValueRight`
* `trimValueRight`

[LiquidJS][liquidjs] 默认 **不会** 移除任何空白字符，也就是说上面几个选项的默认值都为 `false`。这几个选项的详情请参考 [LiquidJS 选项][options]。

## 贪婪模式

上述几个设置默认情况下会跨越换行（`\n`），如果你希望保留上下空行可以把 [greedy 选项][liquidjs] 关掉，这样遇到 `\n` 就会停止。为了和 [shopify/liquid][shopify/liquid] 一致该选项默认是打开的。

[shopify/liquid]: https://github.com/Shopify/liquid
[liquidjs]: https://github.com/harttle/liquidjs
[options]: ../../api/interfaces/liquid_options_.liquidoptions.html
[greedy]: ../../api/interfaces/liquid_options_.liquidoptions.html#Optional-greedy