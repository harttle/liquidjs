---
title: 贡献指南
---

## Star LiquidJS 👉👉👉 [![harttle/liquidjs](https://img.shields.io/github/stars/harttle/liquidjs?style=flat-square)][liquidjs]

Star 是支持 LiquidJS 最重要的方式，也是最简单的方式：通过提升排名来让更多人了解 LiquidJS，让它得到更好的改进。

## 发起 Pull Request

开发和构建描述在这篇文档里 [CONTRIBUTING.md](https://github.com/harttle/liquidjs/blob/master/CONTRIBUTING.md)。

**代码风格**：LiquidJS 采用 [standard](https://github.com/standard/eslint-config-standard) 和 [@typescript-eslint/recommended](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/src/configs/recommended.json) 规则。

**测试**：确保你改动之后测试仍然可以通过 `npm test`

**提交消息**：请遵守 [Angular 提交消息规范](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits)，尤其注意 [type 标识](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#type)，semantic-release 机器人依赖这个标识自动发布。

**向后兼容**：请考虑向后（之前的旧的版本）兼容。LiquidJS 被用于很多层的软件，包括底层库、编译器、站点生成器、 Web 服务器。对多数最终用户来说，驱动或请求整个系统做一次主版本升级是很难办到的。

## 资金支持

LiquidJS 是开源和免费的，但支持 [Open Collective][oc] 赞助，作为感谢你的名字和头像（或 Logo）会展示在这里，[LiquidJS 首页](https://liquidjs.com/)和 [Github README][liquidjs]。

### 支持者
如果你喜欢 LiquidJS，希望支持我们，你可以成为 Open Collective Backer！

<object type="image/svg+xml" data="https://opencollective.com/liquidjs/backers.svg?avatarHeight=72"></object>

### 赞助商
如果你的公司/业务在使用 LiquidJS，请考虑赞助我们！让 LiquidJS 变得更好，以及保持开放和免费！

<object type="image/svg+xml" data="https://opencollective.com/liquidjs/sponsors.svg?avatarHeight=72"></object>

[oc]: https://opencollective.com/liquidjs/
[shopify/liquid]: https://shopify.github.io/liquid/
[caniuse-promises]: http://caniuse.com/#feat=promises
[pp]: https://github.com/taylorhakes/promise-polyfill
[tutorial]: https://shopify.github.io/liquid/basics/introduction/
[liquidjs]: https://github.com/harttle/liquidjs
