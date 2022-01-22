---
title: 参数解析
---

## 访问原始参数

在 [注册过滤器和标签][register-tags] 中提到，可以通过 `tagToken.args` 来得到标签的原始参数字符串。例如：

```javascript
// Usage: {% random foo bar coo %}
// Output: "foo", "bar" or "coo"
engine.registerTag('random', {
  parse(tagToken) {
    // tagToken.args === "foo bar coo"
    this.items = tagToken.args.split(' ')
  },
  render(context, emitter) {
    // get a random index
    const index = Math.floor(this.items.length * Math.random())
    // output that item
    emitter.write(this.items[index])
  }
})
```

见这个 JSFiddle：<http://jsfiddle.net/ctj364up/2/>。

## 解析参数的值

除了静态的参数字符串之外，我们更希望把动态的值传递给标签。LiquidJS 中的值可以是字面量（字符串、数字等，也可以是当前上下文的变量。

下面是修改过的模板，也包含三个值用来随机。但它们表示的是值而不是静态的字符串。第一个是字符串字面量，第二个是标识符（表示变量），第三个是属性访问表达式，包含两个标识符。

```liquid
{% random "foo" bar obj.coo %}
```

解析这么多种情况会很麻烦，但 LiquidJS 提供了 [Tokenizer][Tokenizer] 类来处理这种情况。

```javascript
const { Liquid, Tokenizer, evalToken } = require('liquidjs')

engine.registerTag('random', {
  parse(tagToken) {
    const tokenizer = new Tokenizer(tagToken.args)
    this.items = []
    while (!tokenizer.end()) {
      // here readValue() returns a LiteralToken or PropertyAccessToken
      this.items.push(tokenizer.readValue())
    }
  },
  * render(context, emitter) {
    const index = Math.floor(this.items.length * Math.random())
    const token = this.items[index]
    // in LiquidJS, we use yield to wait for async call
    const value = yield evalToken(token, context)
    emitter.write(value)
  }
})
```

用上下文 `{ bar: "bar", obj: { coo: "coo" } }` 来调用这个标签可以得到上第一个例子一样的效果。见这个 JSFiddle：<http://jsfiddle.net/ctj364up/3/>.

{% note info 异步和 Promise %}
在 LiquidJS 里异步用生成器实现，这样同样一份标签的实现也可以用于同步的 API 比如 `renderSync()`，`parseAndRenderSync()`，`renderFileSync()`。如果要在标签实现里等待 Promise，只需要把 `await somePromise` 换成 `yield somePromise`，并保留 `* render()` 不要改成 `async render()`。更多细节请参考 <a href="/tutorials/sync-and-async.html">Sync and Async</a>。
{% endnote %}

## 把键值对解析为命名参数

当参数很多时或者有可选参数时，使用命名参数语法会很方便。这时参数由无序的键值对构成，LiquidJS 中的 [Hash][Hash] 类就是来处理这种情况的。

```liquid
{% random from:2, to:max %}
```

上面的例子用来产生 [2, max] 范围内的随机数。我们要用 `Hash` 来解析 `from` 和 `to` 参数。

```javascript
const { Liquid, Hash } = require('liquidjs')

engine.registerTag('random', {
  parse(tagToken) {
    // 解析参数结果，存到 `this.args` 里
    this.args = new Hash(tagToken.args)
  },
  * render(context, emitter) {
    // 在当前 `context` 下计算参数的值
    const {from, to} = yield this.args.render(context)
    const length = to - from + 1
    const value = from + Math.floor(length * Math.random())
    emitter.write(value)
  }
})
```

在 `{ max: 10 }` 上下文上渲染 `{% random from:2, to:max %}` 将会得到 [2, 10] 范围内的随机数。见这个 JSFiddle：<http://jsfiddle.net/ctj364up/4/>。

[register-tags]: /tutorials/register-filters-tags.html
[Tokenizer]: /api/classes/parser_tokenizer_.tokenizer.html
[Hash]: /api/classes/template_tag_hash_.hash.html
