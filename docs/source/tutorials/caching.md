---
title: Caching
---

In a typical website project, we'll have a directory of view templates and they'll be rendered multiple times. In production environment the template files are not likely to be changed over time (other than re-deployments). Thus it makes sense to cache the file contents and the parsed templates (in a kind of AST) to improve performance.

LiquidJS provides multiple ways to cache the parsed templates to improve performance.

## Programmaticly

The [.parse()][parse], [.parseFile()][parseFile], [.parseFileSync()][parseFileSync] APIs are used to parse templates from string or files. The result template can be then rendered multiple times with different context.

Parse from string:

```javascript
var tpl = engine.parse('{{name | capitalize}}');

engine.renderSync(tpl, {name: 'alice'}) // 'Alice'
engine.renderSync(tpl, {name: 'bob'}) // 'Bob'
```

Parse from file:

```javascript
var tpl = engine.parseFileSync('hello');    // contents of `hello.liquid`: {{name}}

engine.renderSync(tpl, {name: 'alice'}) // 'Alice'
engine.renderSync(tpl, {name: 'bob'}) // 'Bob'
```

The template string/file is parsed only once and renderd multiple times using different context. Templates for different files can be stored into a `Map` and can be retrieved directly for subsequent renders.

## The `cache` Option

The [cache option][cache] can be set to instruct liquidjs to use cached parsed templates each time you call [renderFile][renderFile] or [renderFileSync][renderFileSync].

```javascript
var { Liquid } = require('liquidjs');
var engine = new Liquid({
    cache: true
});

// liquidjs parses the hello.liquid, then renders it with {name: 'alice'}
engine.renderFileSync('hello', {name: 'alice'})

// liquidjs finds the cached template, then renders it with {name: 'bob'}
engine.renderFileSync('hello', {name: 'bob'})
```

[parse]: ../api/classes/liquid_.liquid.html#parse
[cache]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-cache
[parseFile]: ../api/classes/liquid_.liquid.html#parseFile
[parseFileSync]: ../api/classes/liquid_.liquid.html#parseFileSync
[renderFile]: ../api/classes/liquid_.liquid.html#renderFile
[renderFileSync]: ../api/classes/liquid_.liquid.html#renderFilesync
