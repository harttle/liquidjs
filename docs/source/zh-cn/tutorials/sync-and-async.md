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

LiquidJS 使用基于生成器的异步实现，来让同一份代码支持同步和异步调用。例如下面的 `UpperTag` 既可以用于 `engine.renderSync()` 也可以用于 `engine.render()`：

```typescript
import { TagToken, Context, Emitter, TopLevelToken, Value, Tag, Liquid } from 'liquidjs'

// Usage: {% upper "alice" %}
// Output: ALICE
engine.registerTag('upper', class UpperTag extends Tag {
  private value: Value
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    this.value = new Value(token.args, liquid)
  }
  * render (ctx: Context, emitter: Emitter) {
    const title = yield this.value.value(ctx)
    emitter.write(title.toUpperCase())
  }
})
```

所有内置标签都兼容同步，可以安全地用于同步或异步 API。实现同时支持同异步的标签，需要：

- render 函数声明成 `* render()`，并且在里面
- 不能直接 `return <Promise>`，
- 不能调用会返回 Promise 的函数。

## 调用返回 Promise 的函数

但 LiquidJS 是支持 `Promise` 的，你仍然可以调用返回 `Promise` 的方法并等它 resolve。只需要把 `await` 换成 `yield`。例如：

```typescript
  * render (ctx: Context, emitter: Emitter) {
    const file = yield this.value.value(ctx)
    const title = yield fs.readFile(file, 'utf8')
    emitter.write(title.toUpperCase())
  }
```

现在 `* render()` 调用了一个返回 Promise 的 API，它就不再兼容同步了。不兼容同步的标签也仍然是合法标签，在异步 API 下也会正常运行。被同步调用时，返回 <code>Promise</code> 的标签会被渲染成 <code>[object Promise]</code>。

## 把 LiquidJS 生成器转换成 Promise

有些 LiquidJS API 会返回 `Promise`，有些会返回生成器。你可以用 [toPromise][toPromise] 来把生成器转换为 `Promise`，比如：

```typescript
import { TagToken, Context, Emitter, TopLevelToken, Value, Tag, Liquid, toPromise } from 'liquidjs'

// Usage: {% upper "alice" %}
// Output: ALICE
engine.registerTag('upper', class UpperTag extends Tag {
  private value: Value
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    this.value = new Value(token.args, liquid)
  }
  async render (ctx: Context, emitter: Emitter) {
    const title = await toPromise(this.value.value(ctx))
    emitter.write(title.toUpperCase())
  }
})
```

## 纯异步标签

如果你的标签就不打算支持同步，可以干脆实现成 `async render()`，这样就可以使用更熟悉的 `await` 了：

```typescript
import { toPromise, TagToken, Context, Emitter, TopLevelToken, Value, Tag, Liquid } from 'liquidjs'

// Usage: {% upper "alice" %}
// Output: ALICE
engine.registerTag('upper', class UpperTag extends Tag {
  private value: Value
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    this.value = new Value(token.args, liquid)
  }
  async render (ctx: Context, emitter: Emitter) {
    const title = await toPromise(this.value.value(ctx))
    emitter.write(`<h1>${title}</h1>`)
  }
})
```

[Liquid]: /api/classes/liquid_.liquid.html
[toPromise]: /api/modules/liquid_.html#toPromise
