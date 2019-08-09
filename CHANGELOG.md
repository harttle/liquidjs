## [8.5.2](https://github.com/harttle/liquidjs/compare/v8.5.1...v8.5.2) (2019-08-09)


### Bug Fixes

* quotation tokenizing, [#151](https://github.com/harttle/liquidjs/issues/151) ([1e4f237](https://github.com/harttle/liquidjs/commit/1e4f237))

## [8.5.1](https://github.com/harttle/liquidjs/compare/v8.5.0...v8.5.1) (2019-08-05)


### Bug Fixes

* publish bin directory to npm, fixes [#146](https://github.com/harttle/liquidjs/issues/146) ([a85b650](https://github.com/harttle/liquidjs/commit/a85b650))

# [8.5.0](https://github.com/harttle/liquidjs/compare/v8.4.1...v8.5.0) (2019-08-01)


### Features

* CLI support ([fc045b5](https://github.com/harttle/liquidjs/commit/fc045b5))

## [8.4.1](https://github.com/harttle/liquidjs/compare/v8.4.0...v8.4.1) (2019-07-22)


### Bug Fixes

* some filters on undefined variable throws, [#140](https://github.com/harttle/liquidjs/issues/140) ([6e6ea0a](https://github.com/harttle/liquidjs/commit/6e6ea0a))

# [8.4.0](https://github.com/harttle/liquidjs/compare/v8.3.0...v8.4.0) (2019-07-06)


### Features

* at_least, at_most, sort_naturual for [#132](https://github.com/harttle/liquidjs/issues/132) ([e6f5f1c](https://github.com/harttle/liquidjs/commit/e6f5f1c))

# [8.3.0](https://github.com/harttle/liquidjs/compare/v8.2.4...v8.3.0) (2019-06-27)


### Features

* fs option implemented by [#138](https://github.com/harttle/liquidjs/issues/138) ([3f5e23c](https://github.com/harttle/liquidjs/commit/3f5e23c))

## [8.2.4](https://github.com/harttle/liquidjs/compare/v8.2.3...v8.2.4) (2019-06-17)


### Performance Improvements

* improve getTemplate() when cache is enabled ([1ffba2b](https://github.com/harttle/liquidjs/commit/1ffba2b))

## [8.2.3](https://github.com/harttle/liquidjs/compare/v8.2.2...v8.2.3) (2019-05-19)


### Bug Fixes

* reverse filter not pure, see [#126](https://github.com/harttle/liquidjs/issues/126) ([505c408](https://github.com/harttle/liquidjs/commit/505c408))

## [8.2.2](https://github.com/harttle/liquidjs/compare/v8.2.1...v8.2.2) (2019-05-12)


### Bug Fixes

* date from integer, [#125](https://github.com/harttle/liquidjs/issues/125) ([fdf0043](https://github.com/harttle/liquidjs/commit/fdf0043))
* pass drops directly to filters/tags ([bef2909](https://github.com/harttle/liquidjs/commit/bef2909))

## [8.2.1](https://github.com/harttle/liquidjs/compare/v8.2.0...v8.2.1) (2019-04-26)


### Bug Fixes

* `default` filter is not working with an empty string, [#122](https://github.com/harttle/liquidjs/issues/122) ([6075c0a](https://github.com/harttle/liquidjs/commit/6075c0a))

# [8.2.0](https://github.com/harttle/liquidjs/compare/v8.1.0...v8.2.0) (2019-04-17)


### Features

* pass context to filters ([00bc1ef](https://github.com/harttle/liquidjs/commit/00bc1ef))

# [8.1.0](https://github.com/harttle/liquidjs/compare/v8.0.3...v8.1.0) (2019-04-02)


### Features

* where filter, working on [#118](https://github.com/harttle/liquidjs/issues/118) ([daa0b57](https://github.com/harttle/liquidjs/commit/daa0b57))

## [8.0.3](https://github.com/harttle/liquidjs/compare/v8.0.2...v8.0.3) (2019-04-01)


### Bug Fixes

* slice filter on negative `begin`, [#117](https://github.com/harttle/liquidjs/issues/117) ([eadb6f3](https://github.com/harttle/liquidjs/commit/eadb6f3))

## [8.0.2](https://github.com/harttle/liquidjs/compare/v8.0.1...v8.0.2) (2019-03-25)


### Performance Improvements

* use polymophism instead duck test ([82d7673](https://github.com/harttle/liquidjs/commit/82d7673))

## [8.0.1](https://github.com/harttle/liquidjs/compare/v8.0.0...v8.0.1) (2019-03-22)


### Bug Fixes

* incorrect scope when using assign with for, fixes [#115](https://github.com/harttle/liquidjs/issues/115) ([defbb58](https://github.com/harttle/liquidjs/commit/defbb58))

# [8.0.0](https://github.com/harttle/liquidjs/compare/v7.5.1...v8.0.0) (2019-03-10)


### Code Refactoring

* use camelCase for JavaScript APIs ([64e0c87](https://github.com/harttle/liquidjs/commit/64e0c87))


### Features

* promise support for drops, working on [#65](https://github.com/harttle/liquidjs/issues/65) ([4a8088d](https://github.com/harttle/liquidjs/commit/4a8088d))


### BREAKING CHANGES

* Options and method names in JavaScript API are now renamed to cammelCase, for a complete list see #109

## [7.5.1](https://github.com/harttle/liquidjs/compare/v7.5.0...v7.5.1) (2019-03-05)


### Bug Fixes

* named params for filters, working on [#113](https://github.com/harttle/liquidjs/issues/113) ([5ffc904](https://github.com/harttle/liquidjs/commit/5ffc904))

# [7.5.0](https://github.com/harttle/liquidjs/compare/v7.4.0...v7.5.0) (2019-03-01)


### Features

* tablerowloop object ([3647305](https://github.com/harttle/liquidjs/commit/3647305))

# [7.4.0](https://github.com/harttle/liquidjs/compare/v7.3.1...v7.4.0) (2019-02-28)


### Bug Fixes

* math filters now return number, resolves [#110](https://github.com/harttle/liquidjs/issues/110) ([b4acdb4](https://github.com/harttle/liquidjs/commit/b4acdb4))


### Features

* exported Drop interface for [#107](https://github.com/harttle/liquidjs/issues/107) ([7bee9fc](https://github.com/harttle/liquidjs/commit/7bee9fc)), closes [#109](https://github.com/harttle/liquidjs/issues/109)

## [7.3.1](https://github.com/harttle/liquidjs/compare/v7.3.0...v7.3.1) (2019-02-25)


### Bug Fixes

* **#108:** remove absolute path in emitted d.ts ([53a835a](https://github.com/harttle/liquidjs/commit/53a835a)), closes [#108](https://github.com/harttle/liquidjs/issues/108)

# [7.3.0](https://github.com/harttle/liquidjs/compare/v7.2.2...v7.3.0) (2019-02-24)


### Features

* nil/null/empty/blank literals, resolves [#102](https://github.com/harttle/liquidjs/issues/102) ([88c9e96](https://github.com/harttle/liquidjs/commit/88c9e96))

## [7.2.2](https://github.com/harttle/liquidjs/compare/v7.2.1...v7.2.2) (2019-02-23)


### Bug Fixes

* filters break when argument contains [()|, fixes [#89](https://github.com/harttle/liquidjs/issues/89) ([e977669](https://github.com/harttle/liquidjs/commit/e977669))

## [7.2.1](https://github.com/harttle/liquidjs/compare/v7.2.0...v7.2.1) (2019-02-22)


### Bug Fixes

* default length for truncate and truncatewords ([56c7992](https://github.com/harttle/liquidjs/commit/56c7992))

# [7.2.0](https://github.com/harttle/liquidjs/compare/v7.1.0...v7.2.0) (2019-02-20)


### Features

* override output/tag delimiter, fixes [#54](https://github.com/harttle/liquidjs/issues/54) ([d20a043](https://github.com/harttle/liquidjs/commit/d20a043))

### BREAKING CHANGES

* `trim_value_left` option renamed to `trim_output_left`, `trim_value_right` option renamed to `trim_output_right`

# [7.1.0](https://github.com/harttle/liquidjs/compare/v7.0.2...v7.1.0) (2019-02-20)


### Features

* throw an Error if delimiter not matched ([c33d8f6](https://github.com/harttle/liquidjs/commit/c33d8f6))

# [7.0.0](https://github.com/harttle/liquidjs/compare/v6.4.3...v7.0.0) (2019-02-14)


### chore

* **TypeScript:** ship Liquid to class ([1cc7249](https://github.com/harttle/liquidjs/commit/1cc7249))


### BREAKING CHANGES

* **TypeScript:** calling `Liquid()` without `new` now becomes invalid

## [6.4.3](https://github.com/harttle/liquidjs/compare/v6.4.2...v6.4.3) (2019-02-13)


### Bug Fixes

* better index.d.ts and a demo ([2015f68](https://github.com/harttle/liquidjs/commit/2015f68)), closes [#98](https://github.com/harttle/liquidjs/issues/98)

## [6.4.2](https://github.com/harttle/liquidjs/compare/v6.4.1...v6.4.2) (2019-01-28)


### Bug Fixes

* **CI:** e2e not building cjs ([dde7b3b](https://github.com/harttle/liquidjs/commit/dde7b3b))

## [6.4.1](https://github.com/harttle/liquidjs/compare/v6.4.0...v6.4.1) (2019-01-28)


### Bug Fixes

* regenerator undefined ([a2caeb5](https://github.com/harttle/liquidjs/commit/a2caeb5))
