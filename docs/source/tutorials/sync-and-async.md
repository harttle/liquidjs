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

### Requirements

All builtin tags are *sync-compatible* and safe to use for both sync and async APIs. To make your custom tag *sync-compatible*, you'll need to avoid return a `Promise`. That means the `render(context, emitter)`:

- Should not directly `return <Promise>`, and
- Should not be declared as `async`.

{% note info Non Sync-Compatible Tags %}
Non <em>sync-compatible</em> tags are also valid tags, will work just fine for asynchronous API calls. When called synchronously, tags that return a <code>Promise</code> will be rendered as <code>[object Promise]</code>.
{% endnote %}

### Await Promises
But LiquidJS is Promise-friendly, right? You can still call Promise-based functions and wait for that Promise within tag implementations. Just replace `await` with `yield` and keep `* render()` instead of `async render()`. e.g.

```typescript
import { TagToken, Context, Emitter, TopLevelToken } from 'liquidjs'

// Usage: {% upper "alice" %}
// Output: ALICE
engine.registerTag('upper', {
    parse: function(tagToken: TagToken, remainTokens: TopLevelToken[]) {
        this.str = tagToken.args
    },
    * render: function(ctx: Context) {
        // _evalValue will behave synchronously when called by synchronous API
        // in which case `ctx.sync == true`
        var str = yield this.liquid._evalValue(this.str, ctx)
        return str.toUpperCase()
    }
})
```

See this JSFiddle: <http://jsfiddle.net/ctj364up/6/>.

## Async-only Tags

For tags that intended to be used only by async API, or those cannot be implemented synchronously, there's no difference between using generator-base syntax or async syntax. I'll call them *async-only tags*.

For example, if the above `this.liquid._evalValue()` doesn't respect `ctx.sync` and always returns a Promise, even if the tag is implemented using `* render()` and `yield this.liquid._evalValue()`, it will be rendered as `<object Promise>` anyway.

For *async-only tags*, you can use async syntax at will. Be careful some APIs in LiquidJS return Promises and others return Generators. You'll need [toPromise][toPromise] API to convert a Generator to a Promise, for example:

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

See this JSFiddle: <http://jsfiddle.net/ctj364up/5/>.

[Liquid]: /api/classes/liquid_.liquid.html
[toPromise]: /api/modules/liquid_.html#toPromise
