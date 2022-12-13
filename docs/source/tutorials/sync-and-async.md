---
title: Sync and Async
---

LiquidJS supports both sync and async evaluate, and can be used with Promises. To reuse the same set of tag/filter implementations in both sync and async, LiquidJS tags are implemented as generators.

## Sync and Async API

All major methods on [Liquid][Liquid] supports both sync and async. These methods return Promises:

- `render()`
- `renderFile()`
- `parseFile()`
- `parseAndRender()`
- `evalValue()`

The synchronous version of methods contains a `Sync` suffix:

- `renderSync()`
- `renderFileSync()`
- `parseFileSync()`
- `parseAndRenderSync()`
- `evalValueSync()`

## Implement Sync-Compatible Tags 

LiquidJS uses a generator-based async implementation to support both async and sync in one piece of tag implementation. For example, below `UpperTag` can be used in both `engine.renderSync()` and `engine.render()`.

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

All builtin tags are implemented this way and safe to use in both sync and async (I'll call it *sync-compatible*). To make your custom tag *sync-compatible*, you'll need to:

- declare render function as `* render()`, in which
- do not directly `return <Promise>`, and
- do not call any APIs that returns a Promise.

## Call APIs that return a Promise

But LiquidJS is Promise-friendly, right? You can still call Promise-based functions and wait for that Promise within tag implementations. Just replace `await` with `yield`. e.g. we're calling `fs.readFile()` which returns a `Promise`:

```typescript
  * render (ctx: Context, emitter: Emitter) {
    const file = yield this.value.value(ctx)
    const title = yield fs.readFile(file, 'utf8')
    emitter.write(title.toUpperCase())
  }
```

Now that this `* render()` calls an API that returns a Promise, so it's no longer *sync-compatible*.

{% note info Non Sync-Compatible Tags %}
Non <em>sync-compatible</em> tags are also valid tags, will work just fine for asynchronous API calls. When called synchronously, tags that return a <code>Promise</code> will be rendered as <code>[object Promise]</code>.
{% endnote %}

## Convert LiquidJS async Generator to Promise

You can convert a Generator to Promise by [toPromise][toPromise], for example:

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

## Async only Tags

If your tag is intend to be used only asynchronously, it can be declared as `async render()` so you can use `await` in its implementation directly:

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
