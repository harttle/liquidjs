---
title: 静态模板分析
---

{% since %}v10.20.0{% endsince %}

{% note warn 实验性功能 %}  
这是一个实验性功能，未来的 API 可能会发生变化，返回的内部结构也可能在不进行主要版本更新的情况下更改。
{% endnote %}

{% note info 同步与异步 %}  
本文中的每种方法都提供了同步和异步版本。请参阅 [Liquid API][liquid-api] 了解完整的参考信息。  
{% endnote %}

## 变量

可以使用 `Liquid.variables(template)` 方法获取模板中使用的变量名称。它会返回一个字符串数组，每个字符串代表一个不同的变量，不包括其属性。

```javascript
import { Liquid } from 'liquidjs'

const engine = new Liquid()

const template = engine.parse(`
<p>
  {% assign title = user.title | capitalize %}
  {{ title }} {{ user.first_name | default: user.name }} {{ user.last_name }}
  {% if user.address %}
    {{ user.address.line1 }}
  {% else %}
    {{ user.email_addresses[0] }}
    {% for email in user.email_addresses %}
       - {{ email }}
    {% endfor %}
  {% endif %}
  {{ a[b.c].d }}
<p>
`)

console.log(engine.variablesSync(template))
```

**输出**

```javascript
[ 'user', 'title', 'email', 'a', 'b' ]
```

可以看到，标签和过滤器参数中的变量也会包含在内，例如示例中的嵌套变量 `b`。  
另外，可以使用 `Liquid.fullVariables(template)` 方法获取包含其属性的完整变量列表。

```javascript
// 上例继续
engine.fullVariables(template).then(console.log)
```

**输出**

```javascript
[
  'user.title',
  'user.first_name',
  'user.name',
  'user.last_name',
  'user.address',
  'user.address.line1',
  'user.email_addresses[0]',
  'user.email_addresses',
  'title',
  'email',
  'a[b.c].d',
  'b.c'
]
```

或者，使用 `Liquid.variableSegments(template)` 获取每个变量路径的字符串和数字数组。

```javascript
// 上例继续
engine.variableSegments(template).then(console.log)
```

**输出**

```javascript
[
  [ 'user', 'title' ],
  [ 'user', 'first_name' ],
  [ 'user', 'name' ],
  [ 'user', 'last_name' ],
  [ 'user', 'address' ],
  [ 'user', 'address', 'line1' ],
  [ 'user', 'email_addresses', 0 ],
  [ 'user', 'email_addresses' ],
  [ 'title' ],
  [ 'email' ],
  [ 'a', [ 'b', 'c' ], 'd' ],
  [ 'b', 'c' ]
]
```

### 全局变量

注意在上述示例中，`title` 和 `email` 被包含在结果中。通常你可能希望排除 `{% assign %}` 标签中定义的变量名，以及由 `{% for %}` 标签引入的临时变量。

为了获取 _全局_ 变量（即由应用开发者提供，而不是模板作者定义的变量）的名称，可以使用 `globalVariables`、`globalFullVariables` 或 `globalVariableSegments` 方法（及其同步版本）。

```javascript
// 上例继续
engine.globalVariableSegments(template).then(console.log)
```

**输出**

```javascript
[
  [ 'user', 'title' ],
  [ 'user', 'first_name' ],
  [ 'user', 'name' ],
  [ 'user', 'last_name' ],
  [ 'user', 'address' ],
  [ 'user', 'address', 'line1' ],
  [ 'user', 'email_addresses', 0 ],
  [ 'user', 'email_addresses' ],
  [ 'a', [ 'b', 'c' ], 'd' ],
  [ 'b', 'c' ]
]
```

### 部分模板

默认情况下，LiquidJS 还会尝试加载和分析任何被包含和渲染的模板。

```javascript
import { Liquid } from 'liquidjs'

const footer = `
<footer>
  <p>&copy; {{ "now" | date: "%Y" }} {{ site_name }}</p>
  <p>{{ site_description }}</p>
</footer>`

const engine = new Liquid({ templates: { footer } })

const template = engine.parse(`
<body>
  <h1>Hi, {{ you | default: 'World' }}!</h1>
  {% assign some = 'thing' %}
  {% include 'footer' %}
</body>
`)

engine.globalVariables(template).then(console.log)
```

**输出**

```javascript
[ 'you', 'site_name', 'site_description' ]
```

可以通过将 `partials` 选项设置为 `false` 来禁用部分模板的分析。

```javascript
// 上例继续
engine.globalVariables(template, { partials: false }).then(console.log)
```

**输出**

```javascript
[ 'you' ]
```

如果 `{% include %}` 标签使用了动态模板名称（无法在渲染模板之前确定的模板名称），即使 `partials` 设置为 `true`，也会被忽略。

### 高级用法

上述示例使用的是 `Liquid` 类的便捷方法，适用于最常见的使用场景。  
如果需要更详细的信息，可以直接处理 [分析结果][static-analysis-interface]，其中每个变量的每次出现都会记录行、列和文件名等信息。

此处是对 [部分模板](#部分模板) 中模板进行 `Liquid.analyze()` 调用后返回的对象示例。

```javascript
{
  variables: {
    you: [
      [String (Variable): 'you'] {
        segments: [ 'you' ],
        location: { row: 2, col: 14, file: undefined }
      }
    ],
    site_name: [
      [String (Variable): 'site_name'] {
        segments: [ 'site_name' ],
        location: { row: 2, col: 41, file: 'footer' }
      }
    ],
    site_description: [
      [String (Variable): 'site_description'] {
        segments: [ 'site_description' ],
        location: { row: 3, col: 9, file: 'footer' }
      }
    ]
  },
  globals: {
    you: [
      [String (Variable): 'you'] {
        segments: [ 'you' ],
        location: { row: 2, col: 14, file: undefined }
      }
    ],
    site_name: [
      [String (Variable): 'site_name'] {
        segments: [ 'site_name' ],
        location: { row: 2, col: 41, file: 'footer' }
      }
    ],
    site_description: [
      [String (Variable): 'site_description'] {
        segments: [ 'site_description' ],
        location: { row: 3, col: 9, file: 'footer' }
      }
    ]
  },
  locals: {
    some: [
      [String (Variable): 'some'] {
        segments: [ 'some' ],
        location: { row: 3, col: 13, file: undefined }
      }
    ]
  }
}
```

### 自定义标签的分析

为了在静态分析中包含自定义标签的结果，这些标签必须实现 [Template 接口]( /api/interfaces/Template.html) 中定义的一些附加方法。LiquidJS 会使用这些方法返回的信息来遍历模板并报告变量使用情况。

并非所有方法都是必须的，这取决于标签的类型。如果标签是一个块标签，具有起始标签、结束标签以及内容，那么它需要实现 [`children()`](/api/interfaces/Template.html#children) 方法。`children()` 需要返回一个生成器，这是为了像 `render()` 一样既可以同步也可以异步调用。该方法应返回当前标签的子节点，例如 HTML 内容、输出语句和标签。

[`blockScope()`](/api/interfaces/Template.html#blockScope) 方法用于告知 LiquidJS 在标签块的持续时间内哪些名称会处于作用域中。这些名称可能依赖于标签的参数，也可能是固定的，例如 `{% for %}` 标签生成的 `forloop`。

无论标签是行内标签还是块标签，如果它接受参数，则应实现 [`arguments()`](/api/interfaces/Template.html#arguments) 方法，该方法负责将标签的参数作为 [`Value`](/api/classes/Value.html) 实例或类型为 [`ValueToken`](/api/types/ValueToken.html) 的标记序列返回。

以下示例展示了块标签如何实现这些方法。有关更多示例，请参见 LiquidJS 的[内置标签][built-in]。

```javascript
import { Liquid, Tag, Hash } from 'liquidjs'

class ExampleTag extends Tag {
  args
  templates

  constructor (token, remainTokens, liquid, parser) {
    super(token, remainTokens, liquid)
    this.args = new Hash(token.tokenizer)
    this.templates = []

    const stream = parser.parseStream(remainTokens)
      .on('tag:endexample', () => { stream.stop() })
      .on('template', (tpl) => this.templates.push(tpl))
      .on('end', () => { throw new Error(`tag ${token.getText()} not closed`) })

    stream.start()
  }

  * render (ctx, emitter) {
    const scope = (yield this.args.render(ctx))
    ctx.push(scope)
    yield this.liquid.renderer.renderTemplates(this.templates, ctx, emitter)
    ctx.pop()
  }

  * children () {
    return this.templates
  }

  * arguments () {
    yield * Object.values(this.args.hash).filter((el) => el !== undefined)
  }

  blockScope () {
    return Object.keys(this.args.hash)
  }
}
```

[liquid-api]: /api/classes/Liquid.html
[static-analysis-interface]: /api/interfaces/StaticAnalysis.html
[built-in]: https://github.com/harttle/liquidjs/tree/master/src/tags
