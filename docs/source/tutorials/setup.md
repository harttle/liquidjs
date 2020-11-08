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

{% note warn Compatibility %} You may need a <a href="https://github.com/taylorhakes/promise-polyfill" target="_blank">Promise polyfill</a> for legacy browsers like IE and Android UC, see <a href="http://caniuse.com/#feat=promises" target="_blank">caniuse statistics</a>. {% endnote %}

## LiquidJS in CLI

LiquidJS is also available from CLI:

```bash
echo '{{"hello" | capitalize}}' | npx liquidjs
```

If you pass a path to a JSON file or a JSON string as the first argument, it will be used as the context for your template.

```bash
echo 'Hello, {{ name }}.' | npx liquidjs '{"name": "Snake"}'
```

## Miscellaneous

A ReactJS demo is also added by [@stevenanthonyrevo](https://github.com/stevenanthonyrevo), see [liquidjs/demo/reactjs/](https://github.com/harttle/liquidjs/blob/master/demo/reactjs/).

[intro]: ./intro-to-liquid.html
