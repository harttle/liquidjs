---
title: 选项
---

[Liquid][liquid] 构造函数接受一个参数对象，用来定义各种模板引擎行为。这些参数都是可选的，比如我可以指定其中一个参数 `cache`：

```javascript
const { Liquid } = require('liquidjs')
const engine = new Liquid({
    cache: true
})
```

{% note info API 文档 %}
下面的所有选项的概述，希望了解具体的类型和签名，请前往 <a href="https://liquidjs.com/api/interfaces/liquid_options_.liquidoptions.html" target="_self">LiquidOptions | API</a>.
{% endnote %}

## cache

**cache** 用来指定是否缓存曾经读取和处理过的模板来提升性能。在生产环境模板会重复渲染的情况会很有用。

默认是 `false`，当设置为 `true` 时会启用一个大小为 1024 的 LRU 缓存。当然也可以传一个数字来指定缓存大小。此外还可以是一个自定义的缓存实现，LiquidJS 会通过它来查找和读写文件。详情请参考 [Caching][caching]。

## dynamicPartials

**dynamicPartials** 表示是否把传给 [include][include], [render][render], [layout][layout] 标签的文件名当做变量处理。默认为 `true`。例如用上下文 `{ file: 'foo.html' }` 渲染下面的模板将会引入文件 `foo.html`：

```liquid
{% include file %}
```

设置 `dynamicPartials: false` 后 LiquidJS 将会尝试去读取 `file`。当你的模板之间都是静态引入关系时会很有用：

```liquid
{% liquid foo.html %}
```

{% note warn Common Pitfall %}
LiquidJS 把这个选项默认值设为 <code>true</code> 以兼容于 shopify/liquid，但如果你在使用 <a href="https://github.com/11ty/eleventy" target="_blank">eleventy</a> 它会设置默认值 <code>false</code> （参考 <a href="https://www.11ty.dev/docs/languages/liquid/#quoted-include-paths" target="_blank">Quoted Include Paths</a>）以兼容于 Jekyll。{% endnote %}

## extname

**extname** 定义了默认的文件后缀，当传入文件名不包含后缀时自动追加。默认值是 `''` 也就是说默认是禁用的。如果设置为 `.liquid`：

```liquid
{% render "foo" %}  没有后缀，添加 ".liquid" 并加载 foo.liquid
{% render "foo.html" %} 已经有后缀了，直接加载 foo.html
```

{% note info 旧版行为 %}
在 2.0.1 之前，<code>extname</code> 默认值为 `.liquid`。要禁用它需要明确设置为 <code>extname: ''</code>。详情参考 <a href="https://github.com/harttle/liquidjs/issues/41" target="_blank">#41</a>。
{% endnote %}

## root

**root** 用来指定 LiquidJS 查找和读取模板的根目录。可以是单个字符串，也可以是一个数组 LiquidJS 会顺序查找。详情请参考 [Render Files][render-file]。

## fs

**fs** 用来自定义文件系统实现，详情请参考 [Abstract File System][abstract-fs]。

## globals

**globals** 用来定义对所有模板可见的全局变量。包括 [render tag][render] 引入的子模板，见 [3185][185]。

## jsTruthy

**jsTruthy** 用来使用 Javascript 的真值判断，默认为 `false` 使用 Shopify 方式。

例如，空字符串在 JavaScript 中为假（`jsTruthy` 为 `true` 时），在 Shopify 真值表中为真。

## 换行和缩进

**greedy**, **trimOutputLeft**, **trimOutputRight**, **trimTagLeft**, **trimTagRight** 选项用来移除 Liquid 语法周围的换行和缩进，详情请参考 [Whitespace Control][wc]。

## 自定义分隔符

**outputDelimiterLeft**, **outputDelimiterRight**, **tagDelimiterLeft**, **tagDelimiterRight** 用来自定义 LiquidJS 中 [标签和过滤器][intro] 的分隔符。例如设置了 `outputDelimiterLeft: <%=, outputDelimiterRight: %>` 后我们可以避免跟其他模板引擎冲突：

```ejs
<%= username | append: ", welcome to LiquidJS!" %>
```

## 严格模式

**strictFilters** 用来启用过滤器的严格模式，如果设置为 `true` 过滤器不存在时解析会抛出异常。默认为 `false`，这时会跳过不存在的过滤器。

**strictVariables** 用来启用变量严格模式。如果设置为 `true` 变量不存在时渲染会抛出异常，默认为 `false` 这时不存在的变量会被渲染为空字符串。

{% note info 不存在的标签 %}
不存在的标签总是会抛出一个解析异常，这一行为无法自定义。
{% endnote %}

[liquid]: ../api/classes/liquid_.liquid.html
[caching]: ./caching.html
[abstract-fs]: ./render-file.html#Abstract-File-System
[render-file]: ./render-file.html
[185]: https://github.com/harttle/liquidjs/issues/185
[render]: ../tags/render.html
[include]: ../tags/include.html
[layout]: ../tags/layout.html
[wc]: ./whitespace-control.html
[intro]: ./intro-to-liquid.html
