---
title: 贡献指南
---

## 发起 Pull Request

**代码风格**：LiquidJS 采用 [standard](https://github.com/standard/eslint-config-standard) 和 [@typescript-eslint/recommended](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/src/configs/recommended.json) 规则，提交前确保可以通过风格检查：

```bash
npm run lint
```

**测试**：确保你改动之后测试仍然可以通过：

```bash
npm test
```

**提交消息**：请遵守 [Angular 提交消息规范](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits)，尤其注意 [type 标识](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#type)，semantic-release 机器人依赖这个标识自动发布。

## Star on Github 👉 [![harttle/liquidjs](https://img.shields.io/github/stars/harttle/liquidjs?style=flat-square)][liquidjs]

这是支持我们最简单的方式：通过提升排名来让更多人了解，让它得到更好的改进。

## 成为赞助者！

LiquidJS 是开源的、免费的，并且 **没有** 商业支持，也 **没有** 任何广告。如果你喜欢 LiquidJS 或你的公司在使用 LiquidJS，请考虑通过 [Open Collective][oc] 或 [Patreon][pt] 赞助，作为感谢你的名字和头像（或 Logo）会展示在这里和 [Github README][liquidjs]。

<object type="image/svg+xml" data="https://opencollective.com/liquidjs/tiers/backer.svg?avatarHeight=72"></object>

[![Become a Patron!](../../icon/become_a_patron_button@2x.png)](https://www.patreon.com/bePatron?u=32321060)

[oc]: https://opencollective.com/liquidjs/
[pt]: https://www.patreon.com/harttle
[shopify/liquid]: https://shopify.github.io/liquid/
[caniuse-promises]: http://caniuse.com/#feat=promises
[pp]: https://github.com/taylorhakes/promise-polyfill
[tutorial]: https://shopify.github.io/liquid/basics/introduction/
[liquidjs]: https://github.com/harttle/liquidjs
