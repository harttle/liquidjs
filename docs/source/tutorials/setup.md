---
title: Setup
---

In case you're not familiar with Liquid Template Language, see [Introduction to Liquid Template Language][intro].

## LiquidJS in Node.js

Install via npm:

```bash
npm install --save liquidjs
```

```javascript
var { Liquid } = require('liquidjs');
var engine = new Liquid();

engine
    .parseAndRender('{{name | capitalize}}', {name: 'alice'})
    .then(console.log);     // outputs 'Alice'
```

{% note info Working Demo %} Here's a working demo for LiquidJS usage in Node.js: <a href="https://github.com/harttle/liquidjs/blob/master/demo/nodejs/" target="_blank">liquidjs/demo/nodejs/</a>.{% endnote %}

Type definitions for LiquidJS are also exported and published, which makes it more enjoyable for TypeScript projects:

```typescript
import { Liquid } from 'liquidjs';
const engine = new Liquid();

engine
    .parseAndRender('{{name | capitalize}}', {name: 'alice'})
    .then(console.log);     // outputs 'Alice'
```

{% note info Working Demo %} Here's a working demo for LiquidJS usage in TypeScript: <a href="https://github.com/harttle/liquidjs/blob/master/demo/typescript/" target="_blank">liquidjs/demo/typescript/</a>.{% endnote %}

## LiquidJS in Browsers

Pre-built UMD bundles are also available:

```html
<!--for production-->
<script src="https://cdn.jsdelivr.net/npm/liquidjs/dist/liquid.browser.min.js"></script>
<!--for development-->
<script src="https://cdn.jsdelivr.net/npm/liquidjs/dist/liquid.browser.umd.js"></script>
```

{% note info Working Demo %} Here's a living demo on jsFiddle: <a href="https://jsfiddle.net/pd4jhzLs/1/" target="_blank">jsfiddle.net/pd4jhzLs/1/</a>, and the source code is also available in <a href="https://github.com/harttle/liquidjs/blob/master/demo/browser/" target="_blank">liquidjs/demo/browser/</a>.{% endnote %}

{% note warn Compatibility %} You may need a <a href="https://github.com/taylorhakes/promise-polyfill" target="_blank">Promise polyfill</a> for legacy browsers like IE and Android UC, see <a href="https://caniuse.com/#feat=promises" target="_blank">caniuse statistics</a>. {% endnote %}

## LiquidJS in CLI

LiquidJS can also be used to render a template directly from CLI using `npx`:

```bash
npx liquidjs --template '{{"hello" | capitalize}}'
```

You can either pass the template inline (as shown above) or you can read it from a file by using the `@` character followed by a path, like so:

```bash
npx liquidjs --template @./some-template.liquid
```

You can also use the `@-` syntax to read the template from `stdin`:

```bash
echo '{{"hello" | capitalize}}' | npx liquidjs --template @-
```

A context can be passed in the same ways (i.e. inline, from a path or piped through `stdin`). The following three are equivalent:

```bash
npx liquidjs --template 'Hello, {{ name }}!' --context '{"name": "Snake"}'
npx liquidjs --template 'Hello, {{ name }}!' --context @./some-context.json
echo '{"name": "Snake"}' | npx liquidjs --template 'Hello, {{ name }}!' --context @-
```

Note that you can only use the `stdin` specifier `@-` for a single argument. If you try to use it for both `--template` and `--context` you will get an error.

The rendered output is written to `stdout` by default, but you can also specify an output file (if the file exists, it will be overwritten):

```bash
npx liquidjs --template '{{"hello" | capitalize}}' --output ./hello.txt
```

You can also pass a number of options to customize template rendering behavior. For example, the `--js-truthy` option can be used to enable JavaScript truthiness:

```bash
npx liquidjs --template @./some-template.liquid --js-truthy
```

Most of the [options available through the JavaScript API][options] are also available from the CLI. For help on available options, use `npx liquidjs --help`.

## Miscellaneous

A ReactJS demo is also added by [@stevenanthonyrevo](https://github.com/stevenanthonyrevo), see [liquidjs/demo/reactjs/](https://github.com/harttle/liquidjs/blob/master/demo/reactjs/).

[intro]: ./intro-to-liquid.html
[options]: ./options.html
