---
title: Contribution Guideline
---

## Star on Github 👉 [![harttle/liquidjs](https://img.shields.io/github/stars/harttle/liquidjs?style=flat-square)][liquidjs]

Starring LiquidJS is the most important and easiest way to support us: boost its rank and expose it to more people, which in turn makes it better.

## Show Me Your Code

**Code Style**: LiquidJS applies [standard](https://github.com/standard/eslint-config-standard) and [@typescript-eslint/recommended](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/src/configs/recommended.json) rules, make sure it's still valid before commit:

```bash
npm run lint
```

**Testing**: Make sure test cases pass with your patch merged:

```bash
npm test
```

**Commit Message**: Please align to [the Angular Commit Message Guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits), especially note the [type identifier](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#type), on which semantic-release bot depends.

**Backward-Compatibility**: please be backward-compatible. LiquidJS is used by multiple layers of softwares, including underlying libraries, compilers, site generators and Web servers. It's not easy to do a major upgrade for most of them.

## Financial Support

LiquidJS is Open Source and Free. To help it live and thrive, please consider contribute on [Open Collective][oc] or [Patreon][pt]. To acknowledge your contribution, your name and avatar will be listed here, [homepage](https://liquidjs.com/) for LiquidJS and on [Github README][liquidjs].

<object type="image/svg+xml" data="https://opencollective.com/liquidjs/tiers/backer.svg?avatarHeight=72"></object>

[![Become a Patron!](../icon/become_a_patron_button@2x.png)](https://www.patreon.com/bePatron?u=32321060)

[oc]: https://opencollective.com/liquidjs/
[pt]: https://www.patreon.com/harttle
[shopify/liquid]: https://shopify.github.io/liquid/
[caniuse-promises]: http://caniuse.com/#feat=promises
[pp]: https://github.com/taylorhakes/promise-polyfill
[tutorial]: https://shopify.github.io/liquid/basics/introduction/
[liquidjs]: https://github.com/harttle/liquidjs
