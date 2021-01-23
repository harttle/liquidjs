---
title: 迁移到 LiquidJS 9
---

LiquidJS 9 有一些基础性的改进，包括一些缺陷修复、新特性、性能提升，也有一些不兼容的变更。

## 新特性

* 同步渲染：新增了 renderSync, parseAndRenderSync, renderFileSync API
* 新的工具：Expression 和 Tokenizer

## 修复

* 布尔逻辑运算顺序，见 [#130](https://github.com/harttle/liquidjs/issues/130)；
* `break` 和 `continue` 会忽略它们之前的代码，见 [#123](https://github.com/harttle/liquidjs/issues/123)；
* React.js 示例无法正确 yarn install，见 [#145](https://github.com/harttle/liquidjs/issues/145)；
* 有时没有正确地等待 Promise 类型的 Drops。

## 性能

* 目标平台提升到 Node.js 8 引起的性能提升（去掉了一些 Polyfill），见 [#137](https://github.com/harttle/liquidjs/issues/137)；
* 内存使用降低了 57.5%，见 [#202](https://github.com/harttle/liquidjs/pull/202)；
* 渲染性能提升了 100.3%，见 [#205](https://github.com/harttle/liquidjs/pull/205)。

## 不兼容的变更

* LiquidJS 不再有默认导出了，以后要使用 `import {Liquid} from 'liquidjs'` 语法。使用 UMD 包里的 `window.Liquid` 也需要改为 `window.liquidjs.Liquid`；
* 移除了重复的静态方法 `Liquid.evalValue`，统一使用示例方法 `liquid.evalValue`；
* 支持的最低目标平台为 Node.js 8，CJS 包（Node.js 下的主入口）不再支持 Node.js &leq; 6 了，ESM（dist/liquid.browser.esm.js）和 UMD（dist/liquid.browser.umd.js, dist/liquid.browser.min.js）包不受影响。