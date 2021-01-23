---
title: Migrate to LiquidJS 9
---

LiquidJS 9 has some fundamental improvements, including bugfixes, new features and performance improvement due to higher target(see #137). There're also some breaking changes.

## Features

* Sync rendering: renderSync, parseAndRenderSync, renderFileSync
* New utils: Expression

## Fixes

* Rewrite boolean expression evaluation order, [#130](https://github.com/harttle/liquidjs/issues/130);
* `break` and `continue` tags omitting output before them, [#123](https://github.com/harttle/liquidjs/issues/123);
* Fixes errors in React.js demo during yarn install, [#145](https://github.com/harttle/liquidjs/issues/145);
* Promise typed Drops are not await-ed some times.

## Performance

* Performance Improvements due to targeting to Node.js 8, see [#137](https://github.com/harttle/liquidjs/issues/137);
* Memory footprint is reduced by 57.5%, see [#202](https://github.com/harttle/liquidjs/pull/202);
* Render performance is improved by 100.3%, see [#205](https://github.com/harttle/liquidjs/pull/205).

## BREAKING CHANGES

* LiquidJS no longer has a default export, use `import {Liquid} from 'liquidjs'` instead. The `window.Liquid` for the UMD bundle is also changed to `window.liquidjs.Liquid`;
* The duplicate static method `Liquid.evalValue` is removed, use the instance method `liquid.evalValue` instead;
* Shipped to Node.js 8, the CJS bundle (main entry in Node.js) nolonger supports Node.js &leq; 6. ESM (dist/liquid.node.esm.js) and UMD (dist/liquid.browser.umd.js, dist/liquid.browser.min.js) bundles are not affected.