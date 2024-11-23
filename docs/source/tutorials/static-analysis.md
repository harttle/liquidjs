---
title: Static Template Analysis
---

{% since %}v10.20.0{% endsince %}

{% note info Sync and Async %}
There are synchronous and asynchronous versions of each of the methods demonstrated on this page. See the [Liquid API](liquid-api) for a complete reference.
{% endnote %}

## Variables

Retrieve the names of variables used in a template with `Liquid.variables(template)`. It returns an array of strings, one string for each distinct variable, without its properties.

```javascript
import { Liquid } from 'liquidjs'

const engine = new Liquid()

const template = engine.parse(`\
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
<p>
`)

console.log(engine.variablesSync(template))
```

**Output**

```javascript
[ 'user', 'title', 'email' ]
```

Alternatively, use `Liquid.fullVariables(template)` to get a list of variables including their properties. Notice that variables from tag and filter arguments are included too.

```javascript
// continued from above
engine.fullVariables(template).then(console.log)
```

**Output**

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
  'email'
]
```

Or use `Liquid.variableSegments(template)` to get an array of strings and numbers that make up each variable's path.

```javascript
// continued from above
engine.variableSegments(template).then(console.log)
```

**Output**

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
  [ 'email' ]
]
```

### Global Variables

Notice, in the examples above, that `title` and `email` are included in the results. Often you'll want to exclude names that are in scope from `{% assign %}` tags, and temporary variables like those introduced by a `{% for %}` tag.

To get names that are expected to be _global_, that is, provided by application developers rather than template authors, use the `globalVariables`, `globalFullVariables` or `globalVariableSegments` methods (or their synchronous equivalents) of a `Liquid` class instance.

```javascript
// continued from above
engine.globalVariableSegments(template).then(console.log)
```

**Output**

```javascript
[
  [ 'user', 'title' ],
  [ 'user', 'first_name' ],
  [ 'user', 'name' ],
  [ 'user', 'last_name' ],
  [ 'user', 'address' ],
  [ 'user', 'address', 'line1' ],
  [ 'user', 'email_addresses', 0 ],
  [ 'user', 'email_addresses' ]
]
```

### Partial Templates

By default, LiquidJS will try to load and analyze any included and rendered templates too.

```javascript
import { Liquid } from 'liquidjs'

const footer = `\
<footer>
  <p>&copy; {{ "now" | date: "%Y" }} {{ site_name }}</p>
  <p>{{ site_description }}</p>
</footer>`

const engine = new Liquid({ templates: { footer } })

const template = engine.parse(`\
<body>
  <h1>Hi, {{ you | default: 'World' }}!</h1>
  {% assign some = 'thing' %}
  {% include 'footer' %}
</body>
`)

engine.globalVariables(template).then(console.log)
```

**Output**

```javascript
[ 'you', 'site_name', 'site_description' ]
```

You can disable analysis of partial templates by setting the `partials` options to `false`.

```javascript
// continue from above
engine.globalVariables(template, { partials: false }).then(console.log)
```

**Output**

```javascript
[ 'you' ]
```

If an `{% include %}` tag uses a dynamic template name (one that can't be determined without rendering the template) it will be ignored, even if `partials` is set to `true`.

### Advanced Usage

The examples so far all use convenience methods of the `Liquid` class, intended to cover the most common use cases. Instead, you can work with [analysis results](static-analysis-interface) directly, which expose the row, column and file name for every occurrence of each variable.

This is an example of an object returned from `Liquid.analyze()`, passing it the template from the [Partial Template](#partial-templates) section above.

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

### Analyzing Custom Tags

For static analysis to include results from custom tags, those tags must implement some additional methods defined on the [Template interface]( /api/interfaces/Template.html). LiquidJS will use the information returned from these methods to traverse the template and report variable usage.

Not all methods are required, depending in the kind of tag. If it's a block with a start tag, end tag and any amount of Liquid markup in between, it will need to implement the [`children()`](/api/interfaces/Template.html#children) method. `children()` is defined as a generator, so that we can use it in synchronous and asynchronous contexts, just like `render()`. It should return HTML content, output statements and tags that are child nodes of the current tag.

The [`blockScope()`](/api/interfaces/Template.html#blockScope) method is responsible for telling LiquidJS which names will be in scope for the duration of the tag's block. Some of these names could depend on the tag's arguments, and some will be fixed, like `forloop` from the `{% for %}` tag.

Whether a tag is an inline tag or a block tag, if it accepts arguments it should implement [`arguments()`](/api/interfaces/Template.html#arguments), which is responsible for returning the tag's arguments as a sequence of [`Value`](/api/classes/Value.html) instances or tokens of type [`ValueToken`](/api/types/ValueToken.html).

This example demonstrates these methods for a block tag. See LiquidJS's [built-in tags](built-in) for more examples.

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
