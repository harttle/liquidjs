---
title: 渲染标签内容
---

自定义标签可以有内容，也可以嵌套使用。本文描述了如何实现一个由*开始标签*，*结束标签*和之间的*标签内容*的自定义标签。

## 渲染标签内容

我们先实现一个简单的 `wrap` 标签，它会把内容包装在 `<div class="wrapper"></div>` 元素里：

```liquid
{% wrap %}
  {{ "hello world!" | capitalize }}
{% endwrap %}
```

期望输出：

```html
<div class='wrapper'>
  Hello world!
</div>
```

首先 [注册][register-tags] 一个名为 `wrap` 的标签，把内容解析到 `this.tpls` 数组里。`parse(tagToken, remainTokens)` 中，

- `tagToken` 是当前 *Token* `{% wrap %}`，
- `remainTokens` 是当前模板中后续所有 *Token* 的数组。

我们要做的是从 `remainTokens` 里拿出来/`.shift()` 足够的标签直到遇到 `endwrap`（其实可以是任意名字，但按照惯例应该叫 `endwrap`）。如果到模板结尾都没遇到 `endwrap`，需要抛出一个标签未关闭的 `Error`。

```javascript
engine.registerTag('wrap', {
  parse(tagToken, remainTokens) {
    this.tpls = []
    let closed = false
    while(remainTokens.length) {
      let token = remainTokens.shift()
      // 得到了结束标签，停止解析
      if (token.name === 'endwrap') {
        closed = true
        break
      }
      // 把 Token 解析成 Template
      // parseToken() 可能会消耗多个 Token
      // 例如 {% if %}...{% endif %}
      let tpl = this.liquid.parser.parseToken(token, remainTokens)
      this.tpls.push(tpl)
    }
    if (!closed) throw new Error(`tag ${tagToken.getText()} not closed`)
  },
  * render(context, emitter) {
    emitter.write("<div class='wrapper'>")
    yield this.liquid.renderer.renderTemplates(this.tpls, context, emitter)
    emitter.write("</div>")
  }
})
```

`.renderTemplates()` 可能是异步的，因此需要 `yield` 来等它完成。更多关于 LiquidJS 异步的信息可以参考 [同步和异步][async]。`render()` 的其他部分比较直观，这是 JSFiddle 版本：<http://jsfiddle.net/por0zcn1/3/>。

## 使用 ParseStream

对于像 [for][for] 和 [if][if] 这样的复杂标签，`parse()` 会变得很复杂。使用 [ParseStream][ParseStream] 工具可以按事件风格来组织 `parse()` 的逻辑。下面是用 `ParseStream` 重写过的 `parse()`，实现了和上面例子中完全一样的功能。

```javascript
parse(tagToken, remainTokens) {
  this.tpls = []
  this.liquid.parser.parseStream(remainTokens)
    .on('template', tpl => this.tpls.push(tpl))
    // 注意这里不能用箭头函数，因为我们需要 `this`
    .on('tag:endwrap', function () { this.stop() })
    .on('end', () => { throw new Error(`tag ${tagToken.getText()} not closed`) })
    .start()
}
```

这是 JSFiddle 链接：<http://jsfiddle.net/por0zcn1/4/>。简单起见，下面的例子都借助 `ParseStream` 来实现。

## 操作上下文

上面的 `wrap` 标签看起来没什么用，反正没它也可以很容易地渲染那部分内容。我们现在来实现一个 `repeat` 标签，把内容渲染两次（还可以[加个参数][parameter]让它渲染任意次）：

```liquid
{% repeat %}
  {{ repeat.i }}. {{ "hello world!" | capitalize }}
{% endrepeat %}`
```

期望输出：

```html
1. Hello world!
2. Hello world!
```

你可能注意到了在 `repeat` 上下文里有个额外的变量 `repeat.i`，这就需要我们操作 *上下文*。

{% note info 上下文 %}
<em>上下文</em> 定义了 Liquid 模板中每个变量的值。在 LiquidJS 中，`Context` 由一个 `Scope` 的栈组成。*Scope* 就是一个普通对象，就像传给 `engine.render(tpl, scope)` 的 `scope` 一样。
{% endnote %}

每次进入新的 *上下文* 时，我们需要 `push` 一个新的 `Scope`。当结束渲染并退出 *上下文* 时，再把 `Scope` 从 *上下文* `pop` 出来。见下面的实现：

```javascript
engine.registerTag('repeat', {
  parse(tagToken, remainTokens) {
    this.tpls = []
    this.liquid.parser.parseStream(remainTokens)
      .on('template', tpl => this.tpls.push(tpl))
      .on('tag:endrepeat', function () { this.stop() })
      .on('end', () => { throw new Error(`tag ${tagToken.getText()} not closed`) })
      .start()
  },
  * render(context, emitter) {
    const repeat = { i: 1 }
    context.push({ repeat })
    yield this.liquid.renderer.renderTemplates(this.tpls, context, emitter)
    repeat.i++
    yield this.liquid.renderer.renderTemplates(this.tpls, context, emitter)
    context.pop()
  }
})
```

`parse()` 部分和 `wrap` 标签完全相同，在 `render()` 部分我们通过调用两次 `.renderTemplates(this.tpls)` 来重复渲染内容。这是 JSFiddle 链接：<http://jsfiddle.net/por0zcn1/2/>。

{% note warn 成对使用 Push 和 Pop %}
必须成对地使用 `context.push()` 和 `context.pop()`。如果忘记 `pop()` 会导致 `Scope` 泄露给后面的模板内容，也可能损坏 *上下文* 栈。.
{% endnote %}

[register-tags]: ./register-filters-tags.html
[async]: ./sync-and-async.html
[for]: ../tags/for.html
[if]: ../tags/if.html
[ParseStream]: ../api/classes/parser_parse_stream_.parsestream.html
[parameter]: ./parse-parameters.html
