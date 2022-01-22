---
title: Parse Parameters
---

## Access Raw Parameters

As covered in [Register Filters/Tags][register-tags], tag parameters is available on `tagToken.args` as a raw string. For example:

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

Here's a JSFiddle version: <http://jsfiddle.net/ctj364up/2/>

## Parse Parameters as Values

Sometimes we need more dynamic tags and want to pass values to the custom tag instead of static strings. Variables in LiquidJS can be literal (string, number, etc.) or a variable from current context scope.

The following modified template also contains 3 values to random from, but they're values instead of static strings. The first one is string literal, second one is an identifier, third one is a property access sequence containing two identifiers.

```liquid
{% random "foo" bar obj.coo %}
```

It can be tricky to parse all these cases manually, but there's a [Tokenizer][Tokenizer] class in LiquidJS you can make use of.

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

Calling this tag in scope `{ bar: "bar", obj: { coo: "coo" } }` yields exactly the same result as the first example. See this JSFiddle: <http://jsfiddle.net/ctj364up/3/>

{% note info Async ans Promises %}
Async calls in LiquidJS are implemented by generators directly, for we can call generators in synchronous manner so this tag implementation is also valid for `renderSync()`, `parseAndRenderSync()`, `renderFileSync()`. If you need to await a promise in tag implementation, simply replace `await somePromise` with `yield somePromise` and keep `* render()` instead of `async render()` will do the trick. See <a href="/tutorials/sync-and-async.html">Sync and Async</a> for more details.
{% endnote %}

## Parse Key-Value Pairs as Named Parameters

Named parameters become very handy when there're optional parameters or lots of parameters, in which case the order of parameters is not important. This is exactly what [Hash][Hash] class is invented for.

```liquid
{% random from:2, to:max %}
```

In the above example, we're trying to generate a random number in the range [2, max]. We'll use `Hash` to parse `from` and `to` parameters.

```javascript
const { Liquid, Hash } = require('liquidjs')

engine.registerTag('random', {
  parse(tagToken) {
    // parse the parameters structure into `this.args`
    this.args = new Hash(tagToken.args)
  },
  * render(context, emitter) {
    // evaluate the parameters in `context`
    const {from, to} = yield this.args.render(context)
    const length = to - from + 1
    const value = from + Math.floor(length * Math.random())
    emitter.write(value)
  }
})
```

Rendering `{% random from:2, to:max %}` in scope `{ max: 10 }` will generate a random number in the range [2, 10]. See this JSFiddle: <http://jsfiddle.net/ctj364up/4/>


[register-tags]: /tutorials/register-filters-tags.html
[Tokenizer]: /api/classes/parser_tokenizer_.tokenizer.html
[Hash]: /api/classes/template_tag_hash_.hash.html
