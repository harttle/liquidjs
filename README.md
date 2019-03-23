# liquidjs

[![npm](https://img.shields.io/npm/v/liquidjs.svg)](https://www.npmjs.org/package/liquidjs)
[![npm](https://img.shields.io/npm/dm/liquidjs.svg)](https://www.npmjs.org/package/liquidjs)
[![Build Status](https://travis-ci.org/harttle/liquidjs.svg?branch=master)](https://travis-ci.org/harttle/liquidjs)
[![Coveralls](https://img.shields.io/coveralls/harttle/liquidjs.svg)](https://coveralls.io/github/harttle/liquidjs?branch=master)
[![GitHub issues](https://img.shields.io/github/issues-closed/harttle/liquidjs.svg)](https://github.com/harttle/liquidjs/issues)
[![GitHub contributors](https://img.shields.io/github/contributors/harttle/liquidjs.svg)](https://github.com/harttle/liquidjs/graphs/contributors)
[![David](https://img.shields.io/david/harttle/liquidjs.svg)](https://david-dm.org/harttle/liquidjs)
[![David Dev](https://img.shields.io/david/dev/harttle/liquidjs.svg)](https://david-dm.org/harttle/liquidjs?type=dev)
[![DUB](https://img.shields.io/dub/l/vibe-d.svg)](https://github.com/harttle/liquidjs/blob/master/LICENSE)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://github.com/harttle/liquidjs)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/harttle/liquidjs)

A [shopify][shopify/liquid] compatible [Liquid][tutorial] template engine in pure JavaScript.

Install via npm:

```bash
npm install --save liquidjs
```

Or include the UMD build:

```html
<script src="//unpkg.com/liquidjs/dist/liquid.min.js"></script>     <!--for production-->
<script src="//unpkg.com/liquidjs/dist/liquid.js"></script>         <!--for development-->
```

You may need a [Promise polyfill][pp] for Node.js < 4 and ES5 browsers like [IE and Android UC][caniuse-promises].

## TOC

* Get Started
    * [Render from String](#render-from-string)
    * [Render from File](#render-from-file)
    * [Use with Express.js](#use-with-expressjs)
    * [Include Partials](#include-partials)
    * [Layout Templates (Extends)](#layout-templates-extends)
* Demos
    * Node.js: [/demo/node/](demo/node/)
    * Browser: <https://jsfiddle.net/6u40xbzs/>, [/demo/browser/](demo/browser/).
    * Express.js: [/demo/express/](demo/express/)
    * TypeScript: [/demo/typescript/](demo/typescript/)
    * React JS: [/demo/reactjs/](demo/reactjs/)
* Advanced
    * [Options](#options)
    * [Register Filters](#register-filters), [Builtin Filters](https://github.com/harttle/liquidjs/wiki/Builtin-Filters)
    * [Register Tags](#register-tags), [Builtin Tags](https://github.com/harttle/liquidjs/wiki/Builtin-Tags)
    * [Operators](https://github.com/harttle/liquidjs/wiki/Operators)
    * [Whitespace Control](https://github.com/harttle/liquidjs/wiki/Whitespace-Control)
    * [Plugin API](#plugin-api)
    * [Differences With shopify/liquid](#differences-with-shopify%2fliquid)
* [Contribute Guidelines](#contribute-guidelines)

## Render from String

Just render a template string with a context:

```javascript
var Liquid = require('liquidjs');
var engine = new Liquid();

engine
    .parseAndRender('{{name | capitalize}}', {name: 'alice'})
    .then(console.log);     // outputs 'Alice'
```

Caching parsed templates:

```javascript
var tpl = engine.parse('{{name | capitalize}}');
engine
    .render(tpl, {name: 'alice'})
    .then(console.log);     // outputs 'Alice'
```

## Render from File

```javascript
var engine = new Liquid({
    root: path.resolve(__dirname, 'views/'),  // root for layouts/includes lookup
    extname: '.liquid'          // used for layouts/includes, defaults ""
});
engine
    .renderFile("hello", {name: 'alice'})   // will read and render `views/hello.liquid`
    .then(console.log)  // outputs "Alice"
```

## Use with Express.js

```javascript
// register liquid engine
app.engine('liquid', engine.express()); 
app.set('views', './views');            // specify the views directory
app.set('view engine', 'liquid');       // set to default
```

[`views`][express-views] in express.js will be included when looking up
partials(includes and layouts).

## Include Partials

```
// file: color.liquid
color: '{{ color }}' shape: '{{ shape }}'

// file: theme.liquid
{% assign shape = 'circle' %}
{% include 'color' %}
{% include 'color' with 'red' %}
{% include 'color', color: 'yellow', shape: 'square' %}
```

The output will be:

```
color: '' shape: 'circle'
color: 'red' shape: 'circle'
color: 'yellow' shape: 'square'
```

## Layout Templates (Extends)

```
// file: default-layout.liquid
Header
{% block content %}My default content{% endblock %}
Footer

// file: page.liquid
{% layout "default-layout" %}
{% block content %}My page content{% endblock %}
```

The output of `page.liquid`:

```
Header
My page content
Footer
```

* It's possible to define multiple blocks.
* block name is optional when there's only one block.

## Options

The full list of options for `Liquid()` is listed as following:

* `root` is a directory or an array of directories to resolve layouts and includes, as well as the filename passed in when calling `.renderFile()`.
If an array, the files are looked up in the order they occur in the array.
Defaults to `["."]`

* `extname` is used to lookup the template file when filepath doesn't include an extension name. Eg: setting to `".html"` will allow including file by basename. Defaults to `""`.

* `cache` indicates whether or not to cache resolved templates. Defaults to `false`.

* `dynamicPartials`: if set, treat `<filepath>` parameter in `{%include filepath %}`, `{%layout filepath%}` as a variable, otherwise as a literal value. Defaults to `true`.

* `strictFilters` is used to enable strict filter existence. If set to `false`, undefined filters will be rendered as empty string. Otherwise, undefined filters will cause an exception. Defaults to `false`.

* `strictVariables` is used to enable strict variable derivation. 
If set to `false`, undefined variables will be rendered as empty string.
Otherwise, undefined variables will cause an exception. Defaults to `false`.

* `trimTagRight` is used to strip blank characters (including ` `, `\t`, and `\r`) from the right of tags (`{% %}`) until `\n` (inclusive). Defaults to `false`.

* `trimTagLeft` is similiar to `trimTagRight`, whereas the `\n` is exclusive. Defaults to `false`. See [Whitespace Control][whitespace control] for details.

* `trimOutputRight` is used to strip blank characters (including ` `, `\t`, and `\r`) from the right of values (`{{ }}`) until `\n` (inclusive). Defaults to `false`.

* `trimOutputLeft` is similiar to `trimOutputRight`, whereas the `\n` is exclusive. Defaults to `false`. See [Whitespace Control][whitespace control] for details.

* `tagDelimiterLeft` and `tagDelimiterRight` are used to override the delimiter for liquid tags.

* `outputDelimiterLeft` and `outputDelimiterRight` are used to override the delimiter for liquid outputs.

* `greedy` is used to specify whether `trim*Left`/`trim*Right` is greedy. When set to `true`, all consecutive blank characters including `\n` will be trimed regardless of line breaks. Defaults to `true`.

## Register Filters

```javascript
// Usage: {{ name | uppper }}
engine.registerFilter('upper', v => v.toUpperCase())
```

Filter arguments will be passed to the registered filter function, for example:

```javascript
// Usage: {{ 1 | add: 2, 3 }}
engine.registerFilter('add', (initial, arg1, arg2) => initial + arg1 + arg2)
```

See existing filter implementations here: <https://github.com/harttle/liquidjs/tree/master/src/builtin/filters>

## Register Tags

```javascript
// Usage: {% upper name%}
engine.registerTag('upper', {
    parse: function(tagToken, remainTokens) {
        this.str = tagToken.args; // name
    },
    render: async function(scope, hash) {
        var str = await Liquid.evalValue(this.str, scope); // 'alice'
        return str.toUpperCase()  // 'Alice'
    }
});
```

* `parse`: Read tokens from `remainTokens` until your end token.
* `render`: Combine scope data with your parsed tokens into HTML string.

See existing tag implementations here: <https://github.com/harttle/liquidjs/tree/master/src/builtin/tags>

## Plugin API

A pack of tags or filters can be encapsulated into a **plugin**, which will be typically installed via npm.

```javascript
engine.plugin(require('./some-plugin'));

// some-plugin.js
module.exports = function (Liquid) {
    // here `this` refers to the engine instance
    // `Liquid` provides facilities to implement tags and filters
    this.registerFilter('foo', x => x);
}
```

Plugin List:

* To add your plugin, contact me or simply send a PR.

## Differences With shopify/liquid

Though being compatible with [Ruby Liquid](https://github.com/shopify/liquid) is one of our priorities, there're still certain differences. You may need some configuration to get it compatible in these senarios:

* Dynamic file locating (enabled by default), that means layout/partial names are treated as variables in liquidjs. See [#51](https://github.com/harttle/liquidjs/issues/51).
* Truthy and Falsy. All values except `undefined`, `null`, `false` are truthy, whereas in Ruby Liquid all except `nil` and `false` are truthy. See [#26](https://github.com/harttle/liquidjs/pull/26).
* Number Rendering. Since JavaScript do not distinguish `float` and `integer`, we cannot either convert between them nor render regarding to their type. See [#59](https://github.com/harttle/liquidjs/issues/59).
* [.to_liquid()](https://github.com/Shopify/liquid/wiki/Introduction-to-Drops) is replaced by `.toLiquid()`
* [.to_s()](https://www.rubydoc.info/gems/liquid/Liquid/Drop) is replaced by JavaScript `.toString()`

## Contribute Guidelines

This repo uses [eslint](https://eslint.org/) to check code style, [semantic-release](https://github.com/semantic-release/semantic-release) to generate changelog and publish to npm and Github Releases.

* Code Style: <https://github.com/standard/eslint-config-standard>, `npm run lint` to check locally.
* Commit Message: <https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits>

[nunjucks]: http://mozilla.github.io/nunjucks/
[liquid-node]: https://github.com/sirlantis/liquid-node
[shopify/liquid]: https://shopify.github.io/liquid/
[jekyll]: http://jekyllrb.com/
[gh]: https://pages.github.com/
[any-promise]: https://github.com/kevinbeaty/any-promise
[test]: https://github.com/harttle/liquidjs/tree/master/test
[caniuse-promises]: http://caniuse.com/#feat=promises
[whitespace control]: https://github.com/harttle/liquidjs/wiki/Whitespace-Control
[tags]: https://github.com/harttle/liquidjs/wiki/Builtin-Tags
[filters]: https://github.com/harttle/liquidjs/wiki/Builtin-Filters
[express-views]: http://expressjs.com/en/guide/using-template-engines.html
[pp]: https://github.com/taylorhakes/promise-polyfill
[tutorial]: https://shopify.github.io/liquid/basics/introduction/
