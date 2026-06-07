---
title: Render Tag Content
---

Custom tags can have content templates and can be nested. This article describes how to implement custom tags that consist of a *begin tag*, an *end tag*, and template content between them.

## Render Tag Content

We'll start with a simple tag `wrap` which wraps its content into a `<div class="wrapper"></div>` element:

```liquid
{% wrap %}
  {{ "hello world!" | capitalize }}
{% endwrap %}
```

Expected output:

```html
<div class='wrapper'>
  Hello world!
</div>
```

Firstly, [register][register-tags] a tag named `wrap` and parse the content into `this.tpls`. Here in `parse(tagToken, remainTokens)`:

- `tagToken` is current token `{%raw%}{% wrap %}{%endraw%}`, and
- `remainTokens` is an array of all tokens following `{%raw%}{% wrap %}{%endraw%}` until the end of this template file.

Basically, what we need to do is take/`.shift()` enough tags from `remainTokens` until we get an `endwrap` token (the name can be arbitrary, but by convention it should be `endwrap`). And if there's no `endwrap` until the end of the template file, we need to throw a tag-not-closed `Error`.

```javascript
engine.registerTag('wrap', {
  parse(tagToken, remainTokens) {
    this.tpls = []
    let closed = false
    while(remainTokens.length) {
      let token = remainTokens.shift()
      // we got the end tag! stop taking tokens
      if (token.name === 'endwrap') {
        closed = true
        break
      }
      // parse token into template
      // parseToken() may consume more than 1 tokens
      // e.g. {% if %}...{% endif %}
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

`.renderTemplates()` can be async; we need `yield` to wait for it to complete. For more details on async in LiquidJS, see [Sync and Async][async]. Other parts of the `render()` method are quite straightforward. Here's a JSFiddle version: <https://jsfiddle.net/por0zcn1/3/>

## Using ParseStream

When it comes to complex tags like [for][for] and [if][if], the `parse()` can be very complicated. There's a [ParseStream][ParseStream] utility to organize the `parse()` in event-based style. Following is a re-written `parse()` using `ParseStream` that does exactly the same as the example above.

```javascript
parse(tagToken, remainTokens) {
  this.tpls = []
  this.liquid.parser.parseStream(remainTokens)
    .on('template', tpl => this.tpls.push(tpl))
    // note that we cannot use arrow function because we need `this`
    .on('tag:endwrap', function () { this.stop() })
    .on('end', () => { throw new Error(`tag ${tagToken.getText()} not closed`) })
    .start()
}
```

Here's a JSFiddle version: <https://jsfiddle.net/por0zcn1/4/>. For simplicity, the following examples are implemented using `ParseStream`.

## Manipulate the Context

The `wrap` tag above doesn't seem very useful; even without using that tag, we can render the content anyway. Now we're going to implement a `repeat` tag to render the content 2 times (we can also add a [parameter][parameter] to render an arbitrary number of times).

```liquid
{% repeat %}
  {{ repeat.i }}. {{ "hello world!" | capitalize }}
{% endrepeat %}`
```

Expected outputs:

```html
1. Hello world!
2. Hello world!
```

As you've noticed, there's an additional `repeat.i` in the context of `repeat`. That is implemented by manipulating the *Context*.

{% note info Context %}
<em>Context</em> defines the value of each variable in Liquid template. In LiquidJS, a `Context` consists of a stack of `Scope`s. A *Scope* is a plain object like the one specified in `engine.render(tpl, scope)`.
{% endnote %}

Each time we enter a new *Context*, we need to push a new *Scope*. And when we finish rendering and exit the *Context*, we pop the *Scope* from the *Context*. As you can see in the following implementation:

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

The `parse()` is exactly the same as `wrap` tag, we repeat the content simply by calling `.renderTemplates(this.tpls)` twice during `render()`. Here's the JSFiddle: <https://jsfiddle.net/por0zcn1/2/>

{% note warn Use Push & Pop in Pairs %}
`context.push()` and `context.pop()` have to be used in pairs. Failing to `pop()` the *Scope* you pushed will leak the *Scope* to latter templates and may corrupt the *Context* stack.
{% endnote %}

[register-tags]: ./register-filters-tags.html
[async]: ./sync-and-async.html
[for]: ../tags/for.html
[if]: ../tags/if.html
[ParseStream]: /api/classes/ParseStream.html
[parameter]: ./parse-parameters.html
