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

## 缓存

**cache** 用来指定是否缓存曾经读取和处理过的模板来提升性能。在生产环境模板会重复渲染的情况会很有用。

默认是 `false`，当设置为 `true` 时会启用一个大小为 1024 的 LRU 缓存。当然也可以传一个数字来指定缓存大小。此外还可以是一个自定义的缓存实现，LiquidJS 会通过它来查找和读写文件。详情请参考 [Caching][caching]。

## 布局和片段

**root** 用来指定 LiquidJS 查找和读取模板的根目录。可以是单个字符串，也可以是一个数组 LiquidJS 会顺序查找。详情请参考 [Render Files][render-file]。

**layouts** 和 `root` 具有一样的格式，用来指定 `{% layout %}` 所使用的目录。没有指定时默认为 `root`。

**partials** 和 `root` 具有一样的格式，用来指定 `{% render %}` 和 `{% include %}` 所使用的目录。没有指定时默认为 `root`。

**relativeReference** 默认为 `true` 用来允许以相对路径引用其他文件。注意被引用的文件仍然需要在对应的 root 目录下。例如可以这样引用一个文件 `{% render ../foo/bar %}`，但需要确保 `../foo/bar` 处于 `partials` 目录下。

## 动态引用

> 注意由于历史原因这个选项叫做 dynamicPartials，但它对 layout 也起作用。

**dynamicPartials** 表示是否把传给 [include][include], [render][render], [layout][layout] 标签的文件名当做变量处理。默认为 `true`。例如用上下文 `{ file: 'foo.html' }` 渲染下面的模板将会引入文件 `foo.html`：

```liquid
{% include file %}
```

设置 `dynamicPartials: false` 后 LiquidJS 将会尝试去读取 `file`。当你的模板之间都是静态引入关系时会很有用：

```liquid
{% liquid foo.html %}
```

{% note warn 常见陷阱 %}
LiquidJS 把这个选项默认值设为 <code>true</code> 以兼容于 shopify/liquid，但如果你在使用 <a href="https://github.com/11ty/eleventy" target="_blank">eleventy</a> 它会设置默认值 <code>false</code> （参考 <a href="https://www.11ty.dev/docs/languages/liquid/#quoted-include-paths" target="_blank">Quoted Include Paths</a>）以兼容于 Jekyll。{% endnote %}

## Jekyll include

{% since %}v9.33.0{% endsince %}

[jekyllInclude][jekyllInclude] 用来启用 Jekyll-like include 语法。默认为 `false`，当设置为 `true` 时：

- 默认启用静态文件名：`dynamicPartials` 的默认值变为 `false`（而非 `true`）。但你也可以把它设置回 `true`。
- 参数的键和值之间由 `=` 分隔（本来是 `:`）。
- 参数放到了 `include` 变量下，而非当前作用域。

例如下面的模板中，`name.html` 没有带引号，`header` 和 `"HEADER"` 以 `=` 分隔，`header` 参数通过 `include.header` 来引用。更多详情请参考 [include][include]。

```liquid
// entry template
{% include article.html header="HEADER" content="CONTENT" %}

// article.html
<article>
  <header>{{include.header}}</header>
  {{include.content}}
</article>
```

## extname

**extname** 定义了默认的文件后缀，当传入文件名不包含后缀时自动追加。默认值是 `''` 也就是说默认是禁用的。如果设置为 `.liquid`：

```liquid
{% render "foo" %}  没有后缀，添加 ".liquid" 并加载 foo.liquid
{% render "foo.html" %} 已经有后缀了，直接加载 foo.html
```

{% note info 旧版行为 %}
在 2.0.1 之前，<code>extname</code> 默认值为 `.liquid`。要禁用它需要明确设置为 <code>extname: ''</code>。详情参考 <a href="https://github.com/harttle/liquidjs/issues/41" target="_blank">#41</a>。
{% endnote %}

## fs

**fs** 用来自定义文件系统实现，详情请参考 [Abstract File System][abstract-fs]。

## globals

**globals** 用来定义对所有模板可见的全局变量。包括 [render tag][render] 引入的子模板，见 [3185][185]。

## jsTruthy

**jsTruthy** 用来使用 Javascript 的真值判断，默认为 `false` 使用 Shopify 方式。

例如，空字符串在 JavaScript 中为假（`jsTruthy` 为 `true` 时），在 Shopify 真值表中为真。

## 时间日期和时区

**timezoneOffset** 用来指定一个和你当地时区不同的时区，所有日期和时间输出时都转换到这个指定的时区。例如设置 `timezoneOffset: 0` 将会把所有日期按照 UTC/GMT 00:00 来输出。

**preserveTimezones** 是一个布尔值，只影响时间戳字面量。当设置为 `true` 时，所有字面量的时间戳字符串会在输出时保持原状，即不论输入时采取怎样的时区，输出时仍然采用那一时区（和 Shopify Liquid 的行为一致）。注意这是一个解析器参数，渲染时传入的数据中的日期的输出不会受此参数影响。注意 `preserveTimezones` 比 `timezoneOffset` 的优先级更高。


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

**ownPropertyOnly** 用来隐藏原型上的变量，如果你需要把未经处理过的对象传递给模板时，可以设置 `ownPropertyOnly` 为 `true`，默认为 `false`。

{% note info 不存在的标签 %}
不存在的标签总是会抛出一个解析异常，这一行为无法自定义。
{% endnote %}

## 参数顺序

默认会忽略参数出现的顺序，例如 `{% for i in (1..8) reversed limit:3 %}` 里总是会先执行 `limit` 再执行 `reversed`，虽然 `reversed` 先出现。为了让 LiquidJS 按顺序执行参数，需要设置 **orderedFilterParameters** 为 `true`。它的默认值为 `false`。

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
[jekyllInclude]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-jekyllInclude
