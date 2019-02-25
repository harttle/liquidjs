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
