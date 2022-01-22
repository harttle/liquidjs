---
title: 同步和异步
---

LiquidJS 支持同步调用也支持异步调用，支持 Promise。为了同异步复用一套标签和过滤器，LiquidJS 标签用生成器来实现。

## 同异步 API

[Liquid][Liquid] 上主要的方法都支持同步和异步，下面这些方法返回 `Promise`：

- `render()`
- `renderFile()`
- `parseFile()`
- `parseAndRender()`
- `evalValue()`

它们的同步版本带一个 `Sync` 后缀：

- `renderSync()`
- `renderFileSync()`
- `parseFileSync()`
- `parseAndRenderSync()`
- `evalValueSync()`

## 如何实现兼容同步的标签

### 要求

所有内置标签都兼容同步，可以安全地用于同步或异步 API。为了让你的自定义标签页支持同步，你的标签不能返回 `Promise`，这意味着你的 `render(context, emitter)` 函数：

- 不能直接 `return <Promise>`，
- 也不能声明为 `async`。

{% note info 不兼容同步的标签 %}
不兼容同步的标签也仍然是合法标签，在异步 API 下也会正常运行。被同步调用时，返回 <code>Promise</code> 的标签会被渲染成 <code>[object Promise]</code>。
{% endnote %}

### 等待 Promise
但 LiquidJS 是支持 `Promise` 的，你仍然可以调用返回 `Promise` 的方法并等它 resolve。只需要把 `await` 换成 `yield` 并保留 `* render()` 不要改成 `async render()`。例如：

```typescript
import { TagToken, Context, Emitter, TopLevelToken } from 'liquidjs'

// Usage: {% upper "alice" %}
// Output: ALICE
engine.registerTag('upper', {
    parse: function(tagToken: TagToken, remainTokens: TopLevelToken[]) {
        this.str = tagToken.args
    },
    * render: function(ctx: Context) {
        // 同步调用时 `ctx.sync == true`，`_evalValue()` 会同步地执行
        var str = yield this.liquid._evalValue(this.str, ctx)
        return str.toUpperCase()
    }
})
```

见这个 JSFiddle：<http://jsfiddle.net/ctj364up/6/>。

## 只支持异步的标签

对于只用于异步 API 的标签，或者只能实现为异步的标签，使用生成器语法和 async 语法并没有区别。

例如，如果上面的 `this.liquid._evalValue()` 不会检查 `ctx.sync` 而且总是返回一个 `Promise`，那么即使这个标签用 `* render()` 和 `yield this.liquid._evalValue()` 实现，最终也会渲染成 `<object Promise>`。

这时可以直接使用 async 语法。注意有些 LiquidJS API 会返回 `Promise`，有些会返回生成器。你需要用 [toPromise][toPromise] API 来把生成器转换为 `Promise`，比如：

```typescript
import { TagToken, Context, Emitter, TopLevelToken, toPromise } from 'liquidjs'

// Usage: {% upper "alice" %}
// Output: ALICE
engine.registerTag('upper', {
    parse: function(tagToken: TagToken, remainTokens: TopLevelToken[]) {
        this.str = tagToken.args; // name
    },
    render: async function(ctx: Context) {
        var str = await toPromise(this.liquid._evalValue(this.str, ctx));
        // Or use the alternate API that returns a Promise
        // var str = await this.liquid.evalValue(this.str, ctx);
        return str.toUpperCase()
    }
});
```

见这个 JSFiddle：<http://jsfiddle.net/ctj364up/5/>。

[Liquid]: /api/classes/liquid_.liquid.html
[toPromise]: /api/modules/liquid_.html#toPromise
