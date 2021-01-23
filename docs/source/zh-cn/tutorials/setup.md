---
title: 安装和使用
---

如果你还不了解 Liquid 模板语言，请参考 [Liquid 模板语言简介][intro]。

## 在 Node.js 里使用

通过 NPM 安装：

```bash
npm install --save liquidjs
```

```javascript
var { Liquid } = require('liquidjs');
var engine = new Liquid();

engine
    .parseAndRender('{{name | capitalize}}', {name: 'alice'})
    .then(console.log);     // 输出 'Alice'
```

{% note info 示例 %} 这里有一个 LiquidJS 在 Node.js 里使用的例子：<a href="https://github.com/harttle/liquidjs/blob/master/demo/nodejs/" target="_blank">liquidjs/demo/nodejs/</a>.{% endnote %}

LiquidJS 的类型定义也导出并发布到了 NPM 包里，写 TypeScript 的项目可以直接这样使用：

```typescript
import { Liquid } from 'liquidjs';
const engine = new Liquid();

engine
    .parseAndRender('{{name | capitalize}}', {name: 'alice'})
    .then(console.log);     // 输出 'Alice'
```

{% note info 示例 %} 这里有一个 LiquidJS 在 TypeScript 下的例子：<a href="https://github.com/harttle/liquidjs/blob/master/demo/typescript/" target="_blank">liquidjs/demo/typescript/</a>.{% endnote %}

## 在浏览器里使用

LiquidJS 预先构建了 UMD Bundle，可以通过 jsDelivr CDN 来引用：

```html
<script src="https://cdn.jsdelivr.net/npm/liquidjs/dist/liquid.browser.min.js"></script>     <!--生产环境-->
<script src="https://cdn.jsdelivr.net/npm/liquidjs/dist/liquid.browser.umd.js"></script>         <!--开发环境-->
```

{% note info 示例 %} 这里有一个 jsFiddle 上的在线例子：<a href="https://jsfiddle.net/x43eb0z6/" target="_blank">jsfiddle.net/x43eb0z6</a>，其源码也可以在 <a href="https://github.com/harttle/liquidjs/blob/master/demo/browser/" target="_blank">liquidjs/demo/browser/</a> 找到。{% endnote %}

{% note warn 兼容性 %} 在类似 IE 和 Android UC 这样的浏览器中，你可能需要引入 <a href="https://github.com/taylorhakes/promise-polyfill" target="_blank">Promise polyfill</a>，参看 <a href="http://caniuse.com/#feat=promises" target="_blank">caniuse 的统计</a>。 {% endnote %}

## 在命令行里使用

你还可以在命令行里使用 LiquidJS：

```bash
echo '{{"hello" | capitalize}}' | npx liquidjs
```

模板来自标准输入，数据则来自参数，这个参数可以是一个 JSON 文件的路径，也可以是一个 JSON 字符串：

```bash
echo 'Hello, {{ name }}.' | npx liquidjs '{"name": "Snake"}'
```

## 其他

[@stevenanthonyrevo](https://github.com/stevenanthonyrevo) 还提供了一个 ReactJS demo，请参考 [liquidjs/demo/reactjs/](https://github.com/harttle/liquidjs/blob/master/demo/reactjs/)。

[intro]: ./intro-to-liquid.html