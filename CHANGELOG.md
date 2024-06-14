## [10.13.1](https://github.com/harttle/liquidjs/compare/v10.13.0...v10.13.1) (2024-05-24)


### Bug Fixes

* allow liquidMethodMissing to return any supported value type ([#698](https://github.com/harttle/liquidjs/issues/698)) ([0983f2c](https://github.com/harttle/liquidjs/commit/0983f2c42012b2b97258d0cdcb07b6d43c904814))
* isComparable full interface check ([#701](https://github.com/harttle/liquidjs/issues/701)) ([55e144a](https://github.com/harttle/liquidjs/commit/55e144a0298047349d55d8483a46b2513303d940))

# [10.13.0](https://github.com/harttle/liquidjs/compare/v10.12.0...v10.13.0) (2024-05-13)


### Features

* array_to_sentence_string and number_of_words filters from Jekyll, [#443](https://github.com/harttle/liquidjs/issues/443) ([50253a9](https://github.com/harttle/liquidjs/commit/50253a98caf5356d3c33e148be66f34fbe75a204))
* date filters from Jekyll ([4955e75](https://github.com/harttle/liquidjs/commit/4955e75be7f38a3fd15e71f2c192cff6f0d6e2d5))
* escape filters from Jekyll, [#443](https://github.com/harttle/liquidjs/issues/443) ([b12eb8a](https://github.com/harttle/liquidjs/commit/b12eb8ab4b58b002459725b6c0ed00159cdc15e6))
* jsonify, inspect, to_integer, normalize_whitespace filters ([842b45c](https://github.com/harttle/liquidjs/commit/842b45c96a46290a1e1ba43fc5cc7a465f4ba9de))
* slugify filter from Jekyll, [#443](https://github.com/harttle/liquidjs/issues/443) ([47ddc11](https://github.com/harttle/liquidjs/commit/47ddc1193b84bbdeb8d48457bb5aead24d5aff77))

# [10.12.0](https://github.com/harttle/liquidjs/compare/v10.11.1...v10.12.0) (2024-04-28)


### Bug Fixes

* case/when array equality, [#673](https://github.com/harttle/liquidjs/issues/673) ([2b63035](https://github.com/harttle/liquidjs/commit/2b630353c478368cb36dbfcb38961b25bf48249e))


### Features

* introduce where_exp filter from Jekyll ([8c7cef9](https://github.com/harttle/liquidjs/commit/8c7cef9f95cda765164ada8d58af7d402b3d3143))

## [10.11.1](https://github.com/harttle/liquidjs/compare/v10.11.0...v10.11.1) (2024-04-21)


### Bug Fixes

* allow %Z for TimezoneDate, update docs accordingly [#684](https://github.com/harttle/liquidjs/issues/684) ([e09657c](https://github.com/harttle/liquidjs/commit/e09657c52b5e9920256d73f99455e2e81cadf065))
* Allow `lenientIf` for multiple operands (issue [#682](https://github.com/harttle/liquidjs/issues/682)) ([#683](https://github.com/harttle/liquidjs/issues/683)) ([490ff43](https://github.com/harttle/liquidjs/commit/490ff4309cc231a25be23df5374a5d032aac144e))

# [10.11.0](https://github.com/harttle/liquidjs/compare/v10.10.2...v10.11.0) (2024-04-14)


### Features

* group_by/group_by_exp/find/find_exp from Jekyll, [#443](https://github.com/harttle/liquidjs/issues/443) ([2b713b7](https://github.com/harttle/liquidjs/commit/2b713b721d1f355309a70ebb5846169c6c03c523))
* pop/shift/unshift filters from Jekyll ([258780e](https://github.com/harttle/liquidjs/commit/258780e9a87ce87534a6bb4336725cb1d38a2998))

## [10.10.2](https://github.com/harttle/liquidjs/compare/v10.10.1...v10.10.2) (2024-03-21)


### Bug Fixes

* contains regression ([#677](https://github.com/harttle/liquidjs/issues/677)) ([05223c4](https://github.com/harttle/liquidjs/commit/05223c4378f9474f4e658af36cb8272e161d681f)), closes [#675](https://github.com/harttle/liquidjs/issues/675)

## [10.10.1](https://github.com/harttle/liquidjs/compare/v10.10.0...v10.10.1) (2024-02-18)


### Bug Fixes

* in conditionals, don't render anything after an else branch ([#671](https://github.com/harttle/liquidjs/issues/671)) ([f816955](https://github.com/harttle/liquidjs/commit/f81695570491ede77975de2c26a07612a2d62c28))
* Rely on equal for computing contains ([#668](https://github.com/harttle/liquidjs/issues/668)) ([1937aa1](https://github.com/harttle/liquidjs/commit/1937aa1f1dce01ee6332f39a6e658e85cbe4f30b))

# [10.10.0](https://github.com/harttle/liquidjs/compare/v10.9.4...v10.10.0) (2023-12-19)


### Features

* Array sum filter ([#661](https://github.com/harttle/liquidjs/issues/661)) ([629d958](https://github.com/harttle/liquidjs/commit/629d958b86a97ddf2921d2285b7c9ea83430004e))

## [10.9.4](https://github.com/harttle/liquidjs/compare/v10.9.3...v10.9.4) (2023-11-04)


### Bug Fixes

* allow unicode to be identifiers, fixes [#655](https://github.com/harttle/liquidjs/issues/655) ([dd7616a](https://github.com/harttle/liquidjs/commit/dd7616acb9a71b77f39d2fa24b6f68a7caef87f1))

## [10.9.3](https://github.com/harttle/liquidjs/compare/v10.9.2...v10.9.3) (2023-10-15)


### Bug Fixes

* package version in released files ([67a5b22](https://github.com/harttle/liquidjs/commit/67a5b229ca9ccabb4aee42bbb5c9f03d4076786a))

## [10.9.2](https://github.com/harttle/liquidjs/compare/v10.9.1...v10.9.2) (2023-08-28)


### Bug Fixes

* handle windows newlines on `newline_to_br` and `strip_newlines` ([88aa63f](https://github.com/harttle/liquidjs/commit/88aa63fd58b5a5824c031acc6f3e4072bedd262f))
* sort and where bug when using `strictVariables` ([8af682d](https://github.com/harttle/liquidjs/commit/8af682d2ca68de99bafd4a7055e4912eeb318f57))

## [10.9.1](https://github.com/harttle/liquidjs/compare/v10.9.0...v10.9.1) (2023-08-23)


### Bug Fixes

* map filter allow nil results in strict mode, fixes [#647](https://github.com/harttle/liquidjs/issues/647) ([45adbd7](https://github.com/harttle/liquidjs/commit/45adbd7008296a94da04d21a35917f744a0f4109))

# [10.9.0](https://github.com/harttle/liquidjs/compare/v10.8.4...v10.9.0) (2023-08-22)


### Bug Fixes

* case should allow multiple values separated by or ([b8e7e2d](https://github.com/harttle/liquidjs/commit/b8e7e2d9467b17ca786e6fb422e9579dd178de76))
* for throws undefined var with a null value with strictVariables ([dc6a301](https://github.com/harttle/liquidjs/commit/dc6a3013874872ac85f1fbe5184c74631122d851))
* remove_last was eating an extra character ([fc27313](https://github.com/harttle/liquidjs/commit/fc2731376f8ef59ac7160f97cef1fb5d94f053db))


### Features

* more flexible squared property read expression, fixes [#643](https://github.com/harttle/liquidjs/issues/643) ([#646](https://github.com/harttle/liquidjs/issues/646)) ([660d9be](https://github.com/harttle/liquidjs/commit/660d9be55f8eac16ca5ac77fd0b38b0d7f94961e))

## [10.8.4](https://github.com/harttle/liquidjs/compare/v10.8.3...v10.8.4) (2023-07-07)


### Bug Fixes

* allow quotes in inline comment tag, fixes [#628](https://github.com/harttle/liquidjs/issues/628) ([bf425c3](https://github.com/harttle/liquidjs/commit/bf425c3adb929e68fa234bee8397560a436595bb))

## [10.8.3](https://github.com/harttle/liquidjs/compare/v10.8.2...v10.8.3) (2023-06-16)


### Bug Fixes

* strftime getSuffix works for all dates ([0b4e2a9](https://github.com/harttle/liquidjs/commit/0b4e2a99790347bea0ab5f7d651f2330e3054601))

## [10.8.2](https://github.com/harttle/liquidjs/compare/v10.8.1...v10.8.2) (2023-06-04)


### Bug Fixes

* sample filter randomness and count=1 case ([fcb930f](https://github.com/harttle/liquidjs/commit/fcb930f0ddf2489fa74cd323f24398d7e9f7717f))

## [10.8.1](https://github.com/harttle/liquidjs/compare/v10.8.0...v10.8.1) (2023-06-04)


### Bug Fixes

* incorrect error message for browser UMD bundle ([3a67eb7](https://github.com/harttle/liquidjs/commit/3a67eb7f1cc7e54d2ec94a985eca4c1f147cdd61))

# [10.8.0](https://github.com/harttle/liquidjs/compare/v10.7.1...v10.8.0) (2023-06-03)


### Bug Fixes

* proper error message for filter syntax error, [#610](https://github.com/harttle/liquidjs/issues/610) ([0480d33](https://github.com/harttle/liquidjs/commit/0480d3317d0e46519ad2adf4ac43f53cddf467c6))
* sed invocations to work out of the box on macOS ([#615](https://github.com/harttle/liquidjs/issues/615)) ([87d4cc7](https://github.com/harttle/liquidjs/commit/87d4cc7e14ece14161285a740be63afc8a88b63c))


### Features

* Add support for the Jekyll sample filter ([#612](https://github.com/harttle/liquidjs/issues/612)) ([ba8b842](https://github.com/harttle/liquidjs/commit/ba8b84245266589e43c0e70d99e12b981d349809))
* Add support for the Jekyll push filter ([#611](https://github.com/harttle/liquidjs/issues/611))
* introduce a matrix with latest Ubuntu and macOS to test the build on macOS as well ([82ba548](https://github.com/harttle/liquidjs/commit/82ba54845f4cd4e1e7660c1557e3cfaa22d68924)), closes [#615](https://github.com/harttle/liquidjs/issues/615)
* precise line/col for tokenization Error, [#613](https://github.com/harttle/liquidjs/issues/613) ([e347e60](https://github.com/harttle/liquidjs/commit/e347e603d76c039cec191d417deab34e7ef1f9a7))

## [10.7.1](https://github.com/harttle/liquidjs/compare/v10.7.0...v10.7.1) (2023-04-24)


### Bug Fixes

* incorrect timezone correction for DST dates, fixes [#604](https://github.com/harttle/liquidjs/issues/604) ([33b3c01](https://github.com/harttle/liquidjs/commit/33b3c010af0cd17a303621331feab0119ca840ce))
* timezoneOffset ignored in date when preserveTimezones is enabled, fixes [#605](https://github.com/harttle/liquidjs/issues/605) ([21ee27b](https://github.com/harttle/liquidjs/commit/21ee27b57503f9d57f228973e1699972484e6089))

# [10.7.0](https://github.com/harttle/liquidjs/compare/v10.6.2...v10.7.0) (2023-03-21)


### Bug Fixes

* update remove.md ([#601](https://github.com/harttle/liquidjs/issues/601)) ([1bddd60](https://github.com/harttle/liquidjs/commit/1bddd60b0191032d324526292027bc7fcd190dc1))


### Features

* JSON format by `space` in `json` filter ([7b87ea8](https://github.com/harttle/liquidjs/commit/7b87ea82d3d63420e548743c5a84a073f0cdad22))

## [10.6.2](https://github.com/harttle/liquidjs/compare/v10.6.1...v10.6.2) (2023-03-19)


### Bug Fixes

* sample FS in render-file.md ([#594](https://github.com/harttle/liquidjs/issues/594)) ([4542ddc](https://github.com/harttle/liquidjs/commit/4542ddcfc3d5e245112a119bf22f0e00cb925791))

## [10.6.1](https://github.com/harttle/liquidjs/compare/v10.6.0...v10.6.1) (2023-03-02)


### Bug Fixes

* [expression] apply value equal for arrays, [#589](https://github.com/harttle/liquidjs/issues/589) ([9c0dc5f](https://github.com/harttle/liquidjs/commit/9c0dc5fa39a31d477a5c5a2c5212034174bf0516))
* strip_html for multi line <script>/<style>/comments, [#70](https://github.com/harttle/liquidjs/issues/70) ([42d2590](https://github.com/harttle/liquidjs/commit/42d25902e855d3c06d5ead071bf55604f495c205))

# [10.6.0](https://github.com/harttle/liquidjs/compare/v10.5.0...v10.6.0) (2023-02-22)


### Features

* LiquidOptions.dateFormat to override default date format ([#587](https://github.com/harttle/liquidjs/issues/587)) ([3fb6646](https://github.com/harttle/liquidjs/commit/3fb66465c6fe1bf4dc2e1ace9157c23d0fc8f859))

# [10.5.0](https://github.com/harttle/liquidjs/compare/v10.4.0...v10.5.0) (2023-02-14)


### Bug Fixes

* "ownPropertyOnly" not respected when passed via "renderOptions" ([d489916](https://github.com/harttle/liquidjs/commit/d489916231779149e110183400e3e597b8ee02ba))


### Features

* Adds support for options to CLI and improves usability ([#586](https://github.com/harttle/liquidjs/issues/586)) ([24c8a1e](https://github.com/harttle/liquidjs/commit/24c8a1e3722e5359f02934e2814f9abfa888ee86))

# [10.4.0](https://github.com/harttle/liquidjs/compare/v10.3.3...v10.4.0) (2023-01-02)


### Features

* support `not` operator, [#575](https://github.com/harttle/liquidjs/issues/575) ([3f21382](https://github.com/harttle/liquidjs/commit/3f21382d43cafa1e32162e58adabd22d5c3709ed))
* support calling `date` without format string, [#573](https://github.com/harttle/liquidjs/issues/573) ([aafaa0b](https://github.com/harttle/liquidjs/commit/aafaa0b4f9e84f466fbcc2cb2ae37fe8704c5272))

## [10.3.3](https://github.com/harttle/liquidjs/compare/v10.3.2...v10.3.3) (2022-12-18)


### Bug Fixes

* type compatible with v9 tag definition, support `Context` as scope in various render APIs, [#570](https://github.com/harttle/liquidjs/issues/570) ([fb6a9f8](https://github.com/harttle/liquidjs/commit/fb6a9f8717cd57522d53687da7e4718b28a7f68a))

## [10.3.2](https://github.com/harttle/liquidjs/compare/v10.3.1...v10.3.2) (2022-12-13)


### Bug Fixes

* re-export error classes, [#569](https://github.com/harttle/liquidjs/issues/569) ([2663ee1](https://github.com/harttle/liquidjs/commit/2663ee16a066c74cbd387fe40154fdeb2136f35a))

## [10.3.1](https://github.com/harttle/liquidjs/compare/v10.3.0...v10.3.1) (2022-12-12)


### Bug Fixes

* support `Context` as `evalValue` parameter, [#568](https://github.com/harttle/liquidjs/issues/568) ([0f4916b](https://github.com/harttle/liquidjs/commit/0f4916bc5a93f5e744e4246336c68f2e89774272))

# [10.3.0](https://github.com/harttle/liquidjs/compare/v10.2.0...v10.3.0) (2022-12-11)


### Features

* support disable outputEscape for specific filters, [#565](https://github.com/harttle/liquidjs/issues/565) ([e6db371](https://github.com/harttle/liquidjs/commit/e6db371519f0fb3b0068347cfb2016aed386c8fa))

# [10.2.0](https://github.com/harttle/liquidjs/compare/v10.1.0...v10.2.0) (2022-12-02)


### Bug Fixes

* `case` should render multiple `when` statements ([d17813e](https://github.com/harttle/liquidjs/commit/d17813ef5217264bd08f741b0e1f713bedf2d464))


### Features

* add remove_last filter ([6c3f1c1](https://github.com/harttle/liquidjs/commit/6c3f1c1e0c0c5d30ef77eaf20df65e149e51e693))
* add replace_last filter ([b4d1e27](https://github.com/harttle/liquidjs/commit/b4d1e27420fcf36ae6d5dbc92cfe4a26299690f2))

# [10.1.0](https://github.com/harttle/liquidjs/compare/v10.0.0...v10.1.0) (2022-11-29)


### Features

* timezone name for `opts.timezoneOffset` and `date` argument, fixes [#553](https://github.com/harttle/liquidjs/issues/553) ([89c6c76](https://github.com/harttle/liquidjs/commit/89c6c7676d40f23090472a28cbf2fb22f93daad3))

# [10.0.0](https://github.com/harttle/liquidjs/compare/v9.43.0...v10.0.0) (2022-11-27)


### Code Refactoring

* rename filters to snake style, [#487](https://github.com/harttle/liquidjs/issues/487) ([ff112a4](https://github.com/harttle/liquidjs/commit/ff112a4750f91475e9eccdb301d7a468e895f6ca))
* `_evalToken` renamed to `evalToken` ([4e1a30a](https://github.com/harttle/liquidjs/commit/4e1a30a20c579408c87f2d28b9b6ec8e1dda65cc))
* change `ownPropertyOnly` default value to `true` ([7eb6216](https://github.com/harttle/liquidjs/commit/7eb621601c2b05d6e379e5ce42219f2b1f556208))
* delay creation of `operatorsTrie` and hide this implementation ([bb58d3e](https://github.com/harttle/liquidjs/commit/bb58d3e549dc5a5e067895ec4a0b3257b434f225))
* remove `toThenable` export ([ffefd91](https://github.com/harttle/liquidjs/commit/ffefd91fbc0195c589c8c34ae80f2017acfe557c))
* remove use of internal `Context` class in `evalValue` argument ([b115077](https://github.com/harttle/liquidjs/commit/b115077e122a7b90e7972d58174d68aea8edd7bf))


### Performance Improvements

* target Node.js 14 for cjs bundle (main entry) ([1f6ce7c](https://github.com/harttle/liquidjs/commit/1f6ce7c8224123cea318d1aa6c12aa091d6e0518))


### BREAKING CHANGES

* `evalToken` now returns a generator (LiquidJS async), which is different from `evalToken` in previous LiquidJS versions.
* main entry need Node.js>=14 to run, you can build LiquidJS by your own by using ESM entry.
* `ownPropertyOnly` default value changed to `true`
* `<liquidjs>.toThenable` is removed, use `<liquidjs>.toPromise` instead
* `evalValue` won't support `Context` as second argument anymore.
* use `operators` instead of `operatorsTrie` as Tokenizer constructor argument, #500
* keys in `<liquidjs>.filters` are now in snake case (instead of camel case), identical to that in Liquid template.

# [9.43.0](https://github.com/harttle/liquidjs/compare/v9.42.1...v9.43.0) (2022-11-27)


### Features

* support timezone offset argument for date filter, [#553](https://github.com/harttle/liquidjs/issues/553) ([7a71485](https://github.com/harttle/liquidjs/commit/7a714855df9ba188e2e82839d248f6623ce94a87))

## [9.42.1](https://github.com/harttle/liquidjs/compare/v9.42.0...v9.42.1) (2022-10-21)


### Bug Fixes

* truncatewords should use at least one word, [#537](https://github.com/harttle/liquidjs/issues/537) ([32f613f](https://github.com/harttle/liquidjs/commit/32f613fb43e90f97364ee6a020589992dbb553cf))

# [9.42.0](https://github.com/harttle/liquidjs/compare/v9.41.0...v9.42.0) (2022-08-27)


### Features

* promise in expression & nested property, [#533](https://github.com/harttle/liquidjs/issues/533) [#276](https://github.com/harttle/liquidjs/issues/276) ([bbf00f3](https://github.com/harttle/liquidjs/commit/bbf00f37bf6080d38ebc258d1921d3ff0d504186))

# [9.41.0](https://github.com/harttle/liquidjs/compare/v9.40.0...v9.41.0) (2022-08-24)


### Features

* use evalValue to parse & render expression, [#527](https://github.com/harttle/liquidjs/issues/527) ([071368a](https://github.com/harttle/liquidjs/commit/071368afe1c4fd36ebdb0e1d300c367db1766f7f))

# [9.40.0](https://github.com/harttle/liquidjs/compare/v9.39.2...v9.40.0) (2022-08-14)


### Bug Fixes

* target ES6 for ESM bundles, fixes [#526](https://github.com/harttle/liquidjs/issues/526) ([905a6dd](https://github.com/harttle/liquidjs/commit/905a6dd1491705c1154b6679a67c1eb1ffe7eef5))


### Features

* export toValueSync & defaultOptions to evaluate expression, see [#527](https://github.com/harttle/liquidjs/issues/527) ([e874b40](https://github.com/harttle/liquidjs/commit/e874b4060b46195e05a5cc6690626bdaa532154c))

## [9.39.2](https://github.com/harttle/liquidjs/compare/v9.39.1...v9.39.2) (2022-07-21)


### Bug Fixes

* expression support Drop.valueOf, fixes [#522](https://github.com/harttle/liquidjs/issues/522) ([4ad383d](https://github.com/harttle/liquidjs/commit/4ad383d9beb57f5683805decc1851778db64aea4))

## [9.39.1](https://github.com/harttle/liquidjs/compare/v9.39.0...v9.39.1) (2022-07-14)


### Bug Fixes

* throw ParseError instead of RenderError for invalid assign expression, closes [#519](https://github.com/harttle/liquidjs/issues/519) ([c41a5d5](https://github.com/harttle/liquidjs/commit/c41a5d5babf85ccedbcb3b6f9a3cf5c326f72ae1))

# [9.39.0](https://github.com/harttle/liquidjs/compare/v9.38.0...v9.39.0) (2022-07-09)


### Bug Fixes

* for tag not respecting Drop#valueOf(), fixes [#515](https://github.com/harttle/liquidjs/issues/515) ([c3e51ca](https://github.com/harttle/liquidjs/commit/c3e51caa701fd4449ed5257e23569a37ef12dea2))


### Features

* iteration protocols ([a19feea](https://github.com/harttle/liquidjs/commit/a19feea7c46fc476139a150bda051f485328afe8))

# [9.38.0](https://github.com/harttle/liquidjs/compare/v9.37.0...v9.38.0) (2022-07-07)


### Bug Fixes

* stack overflow on large number of templates, [#513](https://github.com/harttle/liquidjs/issues/513) ([3dc4290](https://github.com/harttle/liquidjs/commit/3dc4290b56265cfafbee8d9836e912d9b8492f90))


### Features

* inline comment tag ([#514](https://github.com/harttle/liquidjs/issues/514)) ([2f87708](https://github.com/harttle/liquidjs/commit/2f8770898963e35ac4491f6975a8abd03dc09067))

# [9.37.0](https://github.com/harttle/liquidjs/compare/v9.36.2...v9.37.0) (2022-04-21)


### Bug Fixes

* support integer arithmetic for `divided_by`, closes [#465](https://github.com/harttle/liquidjs/issues/465) ([e69a510](https://github.com/harttle/liquidjs/commit/e69a51025efa7dec7d60d0067200a1466988ebbc))


### Features

* automatic output escaping, closes [#500](https://github.com/harttle/liquidjs/issues/500) ([f88490c](https://github.com/harttle/liquidjs/commit/f88490cd3cd0b5316c43c3ca76837544d99ce0b0))

## [9.36.2](https://github.com/harttle/liquidjs/compare/v9.36.1...v9.36.2) (2022-04-19)


### Bug Fixes

* lazy createRequire to allow exceptions being catched, fixes [#497](https://github.com/harttle/liquidjs/issues/497) ([b377dad](https://github.com/harttle/liquidjs/commit/b377dad9e34c3de3e0eedc1ee6f17a0e9d919669))

## [9.36.1](https://github.com/harttle/liquidjs/compare/v9.36.0...v9.36.1) (2022-04-17)


### Bug Fixes

* contains operator does not support Drop, fixes [#492](https://github.com/harttle/liquidjs/issues/492) ([9e024ff](https://github.com/harttle/liquidjs/commit/9e024ff2bcf17e7ac19c718389d4cef39b8a51f7))
* responsive header ([a56af6b](https://github.com/harttle/liquidjs/commit/a56af6bbfb5b698db55fbeb87e8e0872688fbe19))
* use `createRequire` for ESM, fixes [#334](https://github.com/harttle/liquidjs/issues/334) ([eec381e](https://github.com/harttle/liquidjs/commit/eec381ec72db3858452799b7a3264e240be3044d))

# [9.36.0](https://github.com/harttle/liquidjs/compare/v9.35.2...v9.36.0) (2022-03-05)


### Features

* Access array item by negative index, closes [#486](https://github.com/harttle/liquidjs/issues/486) ([049685b](https://github.com/harttle/liquidjs/commit/049685b9a0271ba03875e24ff2f6c7870cae62a7))
* allow strip filter with specified char, closes [#390](https://github.com/harttle/liquidjs/issues/390) ([c503cb2](https://github.com/harttle/liquidjs/commit/c503cb23dfbdd6f146d6dea16a84eab3df1f7aa9))
* appropriate error for malformed filters, fixes [#271](https://github.com/harttle/liquidjs/issues/271) ([01014ed](https://github.com/harttle/liquidjs/commit/01014edc491e12d38981045442da9faee598cdf7))

## [9.35.2](https://github.com/harttle/liquidjs/compare/v9.35.1...v9.35.2) (2022-03-02)


### Bug Fixes

* corner case for concat filter without argument, [#481](https://github.com/harttle/liquidjs/issues/481) ([aa95517](https://github.com/harttle/liquidjs/commit/aa955173d4c7adc585e862934429f1f4c5f64969))
* export all builtin tags from LiquidJS, [#464](https://github.com/harttle/liquidjs/issues/464) ([33009bb](https://github.com/harttle/liquidjs/commit/33009bb988eb74c58f390992750d91b967cb3428))

## [9.35.1](https://github.com/harttle/liquidjs/compare/v9.35.0...v9.35.1) (2022-02-26)


### Bug Fixes

* some filters throw on nil input, see [#481](https://github.com/harttle/liquidjs/issues/481) ([7dfb620](https://github.com/harttle/liquidjs/commit/7dfb620d30f8818685e1cfb8e7492313a0d036ab))

# [9.35.0](https://github.com/harttle/liquidjs/compare/v9.34.1...v9.35.0) (2022-02-23)


### Bug Fixes

* `url_encode` throws on undefined value, fixes [#479](https://github.com/harttle/liquidjs/issues/479) ([ca3240c](https://github.com/harttle/liquidjs/commit/ca3240c2c4d157095d2ebe0024d0c71bc5e435f8))


### Features

* expose all tags/filters and TimezoneDate, closes [#464](https://github.com/harttle/liquidjs/issues/464) ([dab8a29](https://github.com/harttle/liquidjs/commit/dab8a29070b2508f2e6532717b7663966f610bec))

## [9.34.1](https://github.com/harttle/liquidjs/compare/v9.34.0...v9.34.1) (2022-02-20)


### Bug Fixes

* array output now join with "" instead of "," ([ab5e245](https://github.com/harttle/liquidjs/commit/ab5e245fba9a0f6936275319d4e5e25aadb0f7c1))
* sort filter unexpectedly modifies original array, [#475](https://github.com/harttle/liquidjs/issues/475) ([dbc0497](https://github.com/harttle/liquidjs/commit/dbc049738633b1b6f578d9d20f830b548ba67a22))

# [9.34.0](https://github.com/harttle/liquidjs/compare/v9.33.1...v9.34.0) (2022-01-28)


### Bug Fixes

* where-filter null handling ([#457](https://github.com/harttle/liquidjs/issues/457)) ([9da41c8](https://github.com/harttle/liquidjs/commit/9da41c8a37d9c49ee4a16d5bd520fd6ae01c14ec))


### Features

* `ownPropertyOnly` option to protect prototype, [#454](https://github.com/harttle/liquidjs/issues/454) ([7e99efc](https://github.com/harttle/liquidjs/commit/7e99efc5131e20cf3f59e1fc2c371a15aa4109db))

## [9.33.1](https://github.com/harttle/liquidjs/compare/v9.33.0...v9.33.1) (2022-01-19)


### Bug Fixes

* liquidjs.version on npm package ([53824a2](https://github.com/harttle/liquidjs/commit/53824a2d00f978214fcd83a48118b7900cf97449))

# [9.33.0](https://github.com/harttle/liquidjs/compare/v9.32.1...v9.33.0) (2022-01-19)


### Features

* support `offset:continue`, see [#439](https://github.com/harttle/liquidjs/issues/439) ([8c27a84](https://github.com/harttle/liquidjs/commit/8c27a84059384ae730eb0fa1524df04e122e27a0))
* support Jekyll-like include syntax, see [#441](https://github.com/harttle/liquidjs/issues/441) ([388d0fb](https://github.com/harttle/liquidjs/commit/388d0fbbc42fe8cd69faba61c1dc29e9bb5ec2d0))

## [9.32.1](https://github.com/harttle/liquidjs/compare/v9.32.0...v9.32.1) (2022-01-12)


### Bug Fixes

* remove limit on operator char length ([7677f84](https://github.com/harttle/liquidjs/commit/7677f848c0c57335dd1c4f1e3ec251fbf9b1663f))

# [9.32.0](https://github.com/harttle/liquidjs/compare/v9.31.0...v9.32.0) (2022-01-02)


### Features

* support allow_false for `default` filter, see [#435](https://github.com/harttle/liquidjs/issues/435) ([c756191](https://github.com/harttle/liquidjs/commit/c756191f49f9c2b823048367abfdf0adf2bdb875))

# [9.31.0](https://github.com/harttle/liquidjs/compare/v9.30.0...v9.31.0) (2021-12-19)


### Features

* implement `liquid` and `echo` tags, see [#428](https://github.com/harttle/liquidjs/issues/428) ([fde9924](https://github.com/harttle/liquidjs/commit/fde9924ee622efae4c013d2aa01c6d705c8d5f46))

# [9.30.0](https://github.com/harttle/liquidjs/compare/v9.29.0...v9.30.0) (2021-12-18)


### Features

* support jekyll-like include, see [#433](https://github.com/harttle/liquidjs/issues/433) ([23279a8](https://github.com/harttle/liquidjs/commit/23279a816a0582ade7f3b15c1c65c74bc147d134))

# [9.29.0](https://github.com/harttle/liquidjs/compare/v9.28.6...v9.29.0) (2021-12-11)


### Features

* customize globals & strictVariables when calling render, see [#432](https://github.com/harttle/liquidjs/issues/432) ([6801552](https://github.com/harttle/liquidjs/commit/6801552fe6829770cbbfdda051731c8b466ed9ec))

## [9.28.6](https://github.com/harttle/liquidjs/compare/v9.28.5...v9.28.6) (2021-12-07)


### Bug Fixes

* size filter does not respect Objects, fixes [#385](https://github.com/harttle/liquidjs/issues/385) ([6c11426](https://github.com/harttle/liquidjs/commit/6c114267a526ef764dfd9bd94de199d2932ad91a))
* throws when using `preserveTimezones` on Node.js, fixes [#431](https://github.com/harttle/liquidjs/issues/431) ([e2ef236](https://github.com/harttle/liquidjs/commit/e2ef236f68273b72a0b1293b0d13728cdb9aa4b8))

## [9.28.5](https://github.com/harttle/liquidjs/compare/v9.28.4...v9.28.5) (2021-11-05)


### Bug Fixes

* always allow './' and '../' to be relative, even on windows ([44f6b52](https://github.com/harttle/liquidjs/commit/44f6b520d53ba984ecb5fc430d70f698837d1802))

## [9.28.4](https://github.com/harttle/liquidjs/compare/v9.28.3...v9.28.4) (2021-10-31)


### Bug Fixes

* allow `{%render%}` to reassign argument, [#404](https://github.com/harttle/liquidjs/issues/404) ([124f4c4](https://github.com/harttle/liquidjs/commit/124f4c4485270a5fdfca610808a56ecd98d98417))

## [9.28.3](https://github.com/harttle/liquidjs/compare/v9.28.2...v9.28.3) (2021-10-27)


### Bug Fixes

* relative root (by default) yields LookupError, fixes [#419](https://github.com/harttle/liquidjs/issues/419), [#424](https://github.com/harttle/liquidjs/issues/424), also related to [#395](https://github.com/harttle/liquidjs/issues/395) ([aebeae9](https://github.com/harttle/liquidjs/commit/aebeae9e1bbb8472af7788dfd09a08cb6de58e1c))

## [9.28.2](https://github.com/harttle/liquidjs/compare/v9.28.1...v9.28.2) (2021-10-16)


### Bug Fixes

* cache ongoing parseFile() calls, fixes [#416](https://github.com/harttle/liquidjs/issues/416) ([8894cbf](https://github.com/harttle/liquidjs/commit/8894cbfe6e0dbad4c07439adcefb6b3e2056be11))

## [9.28.1](https://github.com/harttle/liquidjs/compare/v9.28.0...v9.28.1) (2021-10-16)


### Bug Fixes

* hardcoded '/' in normalized `options.fs`, fixes [#412](https://github.com/harttle/liquidjs/issues/412), [#408](https://github.com/harttle/liquidjs/issues/408) ([9cfa43b](https://github.com/harttle/liquidjs/commit/9cfa43b8aee6a980f39d99f1cdb2be730ca21731))

# [9.28.0](https://github.com/harttle/liquidjs/compare/v9.27.1...v9.28.0) (2021-10-06)


### Bug Fixes

* skip root check for renderFile() ([822ba0b](https://github.com/harttle/liquidjs/commit/822ba0be0f1cfbedd50376aff8ac49eee71bd48c))
* support timezoneOffset for date from scope, [#401](https://github.com/harttle/liquidjs/issues/401) ([fd5ef47](https://github.com/harttle/liquidjs/commit/fd5ef474c36212e6a2446012dcd26bca93f84c7b))


### Features

* `relativeReference` for render/include/layout, [#395](https://github.com/harttle/liquidjs/issues/395) ([a3455eb](https://github.com/harttle/liquidjs/commit/a3455ebd0b207141c34630c0af44d917db2ca1dd))
* implement `forloop.name` as found in ruby shopify/liquid ([6dc7fad](https://github.com/harttle/liquidjs/commit/6dc7fada72467418806c1ee4bd7eaf3003690fe6))

## [9.27.1](https://github.com/harttle/liquidjs/compare/v9.27.0...v9.27.1) (2021-10-04)


### Bug Fixes

* directory info in lookupError message, [#395](https://github.com/harttle/liquidjs/issues/395) ([92bfc65](https://github.com/harttle/liquidjs/commit/92bfc65e0b1d937c00a8368b272223c702132d23))

# [9.27.0](https://github.com/harttle/liquidjs/compare/v9.26.0...v9.27.0) (2021-10-03)


### Bug Fixes

* remove "stream" dependency in browser bundles, [#396](https://github.com/harttle/liquidjs/issues/396) ([3b5eb66](https://github.com/harttle/liquidjs/commit/3b5eb6664f673c29d74cb7645e01dcbdf43c8343))
* renderToNodeStream() now emit 'error' event instead of throw ([afeef1d](https://github.com/harttle/liquidjs/commit/afeef1d7450b2799b3441b0241d2466b892a27ff))


### Features

* add `layouts`, `partials` apart from `root`, [#395](https://github.com/harttle/liquidjs/issues/395) ([b9ae479](https://github.com/harttle/liquidjs/commit/b9ae479b653a34fadb98c324c4683dd1fdd31af1))
* renderFileToNodeStream(filepath, scope) ([68c4cfc](https://github.com/harttle/liquidjs/commit/68c4cfcfb647c22225dd6edede53ad7a5d7c4485))


### Performance Improvements

* make the most of streamed rendering ([aea3441](https://github.com/harttle/liquidjs/commit/aea34418de24cb85ea1acddf68c3683ce7fc9fa8))

# [9.26.0](https://github.com/harttle/liquidjs/compare/v9.25.1...v9.26.0) (2021-09-30)


### Features

* orderedFilterParameters, closes [#312](https://github.com/harttle/liquidjs/issues/312) ([10e8c8f](https://github.com/harttle/liquidjs/commit/10e8c8ff7e1cca6df43087953cd8daf4bd618563))
* stream rendering, closed [#361](https://github.com/harttle/liquidjs/issues/361) fixes [#360](https://github.com/harttle/liquidjs/issues/360) ([9012133](https://github.com/harttle/liquidjs/commit/9012133e0717b1813c6a74a6a282f43ba14d0ada))
* timezoneOffset option to specify output timezone, see [#375](https://github.com/harttle/liquidjs/issues/375) ([6b9f872](https://github.com/harttle/liquidjs/commit/6b9f872bccb4b0c636dc7be2088cafa9bc6c900a))


### Performance Improvements

* improve performance by 4x by simplified parseFile ([24f5346](https://github.com/harttle/liquidjs/commit/24f534608489fccc155f30bbaf37397c46278da6))
* parse filenames in parse() insteadof render() ([8273c17](https://github.com/harttle/liquidjs/commit/8273c17dab3dc09858330ce45e3617a650e7fcaa))

## [9.25.1](https://github.com/harttle/liquidjs/compare/v9.25.0...v9.25.1) (2021-06-20)


### Performance Improvements

* add cross-engines benchmark ([cdceb25](https://github.com/harttle/liquidjs/commit/cdceb25d007b3d30a85e51ac538e12297c73bfcf))

# [9.25.0](https://github.com/harttle/liquidjs/compare/v9.24.2...v9.25.0) (2021-05-07)


### Features

* when tag with multiple values ([8f9639f](https://github.com/harttle/liquidjs/commit/8f9639f))

## [9.24.2](https://github.com/harttle/liquidjs/compare/v9.24.1...v9.24.2) (2021-05-04)


### Bug Fixes

* operator boundary not correctly recognized, fixes [#342](https://github.com/harttle/liquidjs/issues/342) ([3e3d84a](https://github.com/harttle/liquidjs/commit/3e3d84a))

## [9.24.1](https://github.com/harttle/liquidjs/compare/v9.24.0...v9.24.1) (2021-05-01)


### Bug Fixes

* make LiquidError context property public ([1fd76ac](https://github.com/harttle/liquidjs/commit/1fd76ac))

# [9.24.0](https://github.com/harttle/liquidjs/compare/v9.23.4...v9.24.0) (2021-05-01)


### Features

* add context as a property on the LiquidError error ([9c7cb57](https://github.com/harttle/liquidjs/commit/9c7cb57))
* export errors for better error handling in user-land ([4e394b9](https://github.com/harttle/liquidjs/commit/4e394b9))

## [9.23.4](https://github.com/harttle/liquidjs/compare/v9.23.3...v9.23.4) (2021-04-17)


### Bug Fixes

* capitalize filter not lower case trailing string, fixes [#326](https://github.com/harttle/liquidjs/issues/326) ([6548765](https://github.com/harttle/liquidjs/commit/6548765))

## [9.23.3](https://github.com/harttle/liquidjs/compare/v9.23.2...v9.23.3) (2021-03-21)


### Bug Fixes

* expose TokenKind ([dbc23e8](https://github.com/harttle/liquidjs/commit/dbc23e8))

## [9.23.2](https://github.com/harttle/liquidjs/compare/v9.23.1...v9.23.2) (2021-03-13)


### Bug Fixes

* comparison for empty/nil, fixes [#321](https://github.com/harttle/liquidjs/issues/321) ([99d14e7](https://github.com/harttle/liquidjs/commit/99d14e7))
* newline_to_br filter should output <br /> instead of <br/>, fixes [#320](https://github.com/harttle/liquidjs/issues/320) ([9a9b792](https://github.com/harttle/liquidjs/commit/9a9b792))

## [9.23.1](https://github.com/harttle/liquidjs/compare/v9.23.0...v9.23.1) (2021-02-19)


### Bug Fixes

* lenientIf not working for the umd bundle, closes [#313](https://github.com/harttle/liquidjs/issues/313) ([2e66e8b](https://github.com/harttle/liquidjs/commit/2e66e8b))

# [9.23.0](https://github.com/harttle/liquidjs/compare/v9.22.1...v9.23.0) (2021-02-12)


### Bug Fixes

* respect `fs` in parser options, for [#233](https://github.com/harttle/liquidjs/issues/233) ([4e82da6](https://github.com/harttle/liquidjs/commit/4e82da6))


### Features

* support filters in if/unless/case, see [#287](https://github.com/harttle/liquidjs/issues/287) ([2f059f6](https://github.com/harttle/liquidjs/commit/2f059f6))
* support function calls, closes [#222](https://github.com/harttle/liquidjs/issues/222) ([e37824f](https://github.com/harttle/liquidjs/commit/e37824f))
* support layout none, closes [#299](https://github.com/harttle/liquidjs/issues/299) ([81e11bb](https://github.com/harttle/liquidjs/commit/81e11bb))

## [9.22.1](https://github.com/harttle/liquidjs/compare/v9.22.0...v9.22.1) (2021-02-05)


### Bug Fixes

* default to precedence 1 for custom operators ([20f559e](https://github.com/harttle/liquidjs/commit/20f559e))

# [9.22.0](https://github.com/harttle/liquidjs/compare/v9.21.0...v9.22.0) (2021-02-04)


### Features

* compact filter ([f42c217](https://github.com/harttle/liquidjs/commit/f42c217))

# [9.21.0](https://github.com/harttle/liquidjs/compare/v9.20.1...v9.21.0) (2021-02-04)


### Features

* add `operators` option for custom operators ([75591cd](https://github.com/harttle/liquidjs/commit/75591cd))
* create trie programmatically in options ([befc33c](https://github.com/harttle/liquidjs/commit/befc33c))
* export OperatorMap type ([bc87e19](https://github.com/harttle/liquidjs/commit/bc87e19))
* export Operators from operator.ts ([6a7c280](https://github.com/harttle/liquidjs/commit/6a7c280))
* rename to defaultOperators and Operators ([8734e2e](https://github.com/harttle/liquidjs/commit/8734e2e))

## [9.20.1](https://github.com/harttle/liquidjs/compare/v9.20.0...v9.20.1) (2021-01-24)


### Bug Fixes

* allow string literals contain delimiters, fixes [#288](https://github.com/harttle/liquidjs/issues/288) ([9c40da7](https://github.com/harttle/liquidjs/commit/9c40da7))

# [9.20.0](https://github.com/harttle/liquidjs/compare/v9.19.0...v9.20.0) (2021-01-23)


### Features

* support `{{block.super}}`, see [#38](https://github.com/harttle/liquidjs/issues/38) ([a3af44d](https://github.com/harttle/liquidjs/commit/a3af44d))

# [9.19.0](https://github.com/harttle/liquidjs/compare/v9.18.0...v9.19.0) (2020-12-18)


### Bug Fixes

* lint ([de32259](https://github.com/harttle/liquidjs/commit/de32259))
* move offset adding complexity inside TimezoneDate ([26b2175](https://github.com/harttle/liquidjs/commit/26b2175))
* simpler timezone regex and non-null offset ([e3ecfe3](https://github.com/harttle/liquidjs/commit/e3ecfe3))


### Features

* add preserveTimezones option ([d70cd2a](https://github.com/harttle/liquidjs/commit/d70cd2a))
* parse and handle date timezone offsets ([c16c787](https://github.com/harttle/liquidjs/commit/c16c787))

# [9.18.0](https://github.com/harttle/liquidjs/compare/v9.17.0...v9.18.0) (2020-12-17)


### Bug Fixes

* address refactor comments ([6a0ad10](https://github.com/harttle/liquidjs/commit/6a0ad10))


### Features

* add option for keeping variable type in output ([cd92e77](https://github.com/harttle/liquidjs/commit/cd92e77))

# [9.17.0](https://github.com/harttle/liquidjs/compare/v9.16.1...v9.17.0) (2020-12-07)


### Bug Fixes

* elsif is not supported for unless, fixes [#268](https://github.com/harttle/liquidjs/issues/268) ([2bbf501](https://github.com/harttle/liquidjs/commit/2bbf501))
* enforce string-type pattern in `replace`, fixes [#243](https://github.com/harttle/liquidjs/issues/243) ([c8afa39](https://github.com/harttle/liquidjs/commit/c8afa39))
* raw block not ignoring {% characters, fixes [#263](https://github.com/harttle/liquidjs/issues/263) ([a492d8e](https://github.com/harttle/liquidjs/commit/a492d8e))


### Features

* passing liquid to FilterImpl, closes [#277](https://github.com/harttle/liquidjs/issues/277) ([f9f595f](https://github.com/harttle/liquidjs/commit/f9f595f))

## [9.16.1](https://github.com/harttle/liquidjs/compare/v9.16.0...v9.16.1) (2020-10-09)


### Bug Fixes

* braced property access ([18a807e](https://github.com/harttle/liquidjs/commit/18a807e))

# [9.16.0](https://github.com/harttle/liquidjs/compare/v9.15.1...v9.16.0) (2020-10-08)


### Features

* support jsTruthy, [#255](https://github.com/harttle/liquidjs/issues/255) [#257](https://github.com/harttle/liquidjs/issues/257) ([72ee7b4](https://github.com/harttle/liquidjs/commit/72ee7b4))

## [9.15.1](https://github.com/harttle/liquidjs/compare/v9.15.0...v9.15.1) (2020-10-03)


### Bug Fixes

* allow quoted variable name in capture, fixes [#252](https://github.com/harttle/liquidjs/issues/252) ([5b3f419](https://github.com/harttle/liquidjs/commit/5b3f419))

# [9.15.0](https://github.com/harttle/liquidjs/compare/v9.14.1...v9.15.0) (2020-08-04)


### Features

* export toPromise and toValue, see [#158](https://github.com/harttle/liquidjs/issues/158) ([2e5ab98](https://github.com/harttle/liquidjs/commit/2e5ab98))

## [9.14.1](https://github.com/harttle/liquidjs/compare/v9.14.0...v9.14.1) (2020-07-08)


### Bug Fixes

* enumerate Promises (e.g. in for & tablerow) ([#237](https://github.com/harttle/liquidjs/issues/237)) ([941dd66](https://github.com/harttle/liquidjs/commit/941dd66))

# [9.14.0](https://github.com/harttle/liquidjs/compare/v9.13.0...v9.14.0) (2020-06-25)


### Features

* setup universal browser and node builds ([6cf6ffa](https://github.com/harttle/liquidjs/commit/6cf6ffa))

# [9.13.0](https://github.com/harttle/liquidjs/compare/v9.12.0...v9.13.0) (2020-06-25)


### Features

* async filters, closes [#232](https://github.com/harttle/liquidjs/issues/232) ([e36f3ff](https://github.com/harttle/liquidjs/commit/e36f3ff))

# [9.12.0](https://github.com/harttle/liquidjs/compare/v9.11.11...v9.12.0) (2020-05-15)


### Features

* sort by key, see [#227](https://github.com/harttle/liquidjs/issues/227) ([4f17c94](https://github.com/harttle/liquidjs/commit/4f17c94))

## [9.11.11](https://github.com/harttle/liquidjs/compare/v9.11.10...v9.11.11) (2020-05-01)


### Bug Fixes

* properly treat unicode blanks, fixes [#221](https://github.com/harttle/liquidjs/issues/221) ([673b015](https://github.com/harttle/liquidjs/commit/673b015))

## [9.11.10](https://github.com/harttle/liquidjs/compare/v9.11.9...v9.11.10) (2020-04-03)


### Bug Fixes

* respect cache render options ([a93f11d](https://github.com/harttle/liquidjs/commit/a93f11d))

## [9.11.9](https://github.com/harttle/liquidjs/compare/v9.11.8...v9.11.9) (2020-03-31)


### Bug Fixes

* coerce to Array in `map` and `where` filter ([c923598](https://github.com/harttle/liquidjs/commit/c923598))

## [9.11.8](https://github.com/harttle/liquidjs/compare/v9.11.7...v9.11.8) (2020-03-31)


### Bug Fixes

* throw an error if : omitted unintentionally, [#212](https://github.com/harttle/liquidjs/issues/212), [#208](https://github.com/harttle/liquidjs/issues/208) ([8daf281](https://github.com/harttle/liquidjs/commit/8daf281))

## [9.11.7](https://github.com/harttle/liquidjs/compare/v9.11.6...v9.11.7) (2020-03-28)


### Bug Fixes

* try fix travis ([b3db412](https://github.com/harttle/liquidjs/commit/b3db412))

## [9.11.6](https://github.com/harttle/liquidjs/compare/v9.11.5...v9.11.6) (2020-03-25)


### Bug Fixes

* default filter not applied for empty array ([c371762](https://github.com/harttle/liquidjs/commit/c371762))

## [9.11.5](https://github.com/harttle/liquidjs/compare/v9.11.4...v9.11.5) (2020-03-24)


### Bug Fixes

* throws on invalid arguments for prepend/append, fixes [#208](https://github.com/harttle/liquidjs/issues/208) ([479c633](https://github.com/harttle/liquidjs/commit/479c633))

## [9.11.4](https://github.com/harttle/liquidjs/compare/v9.11.3...v9.11.4) (2020-03-23)


### Bug Fixes

* return variable name in include error ([93433a8](https://github.com/harttle/liquidjs/commit/93433a8))

## [9.11.3](https://github.com/harttle/liquidjs/compare/v9.11.2...v9.11.3) (2020-03-14)


### Performance Improvements

* introduce AST to avoid reparse ([d2d6a38](https://github.com/harttle/liquidjs/commit/d2d6a38))
* remove instanceof DelimitedToken ([1673e84](https://github.com/harttle/liquidjs/commit/1673e84))

## [9.11.2](https://github.com/harttle/liquidjs/compare/v9.11.1...v9.11.2) (2020-03-14)


### Performance Improvements

* remove transient strings to reduce memory ([3dfdf98](https://github.com/harttle/liquidjs/commit/3dfdf98))

## [9.11.1](https://github.com/harttle/liquidjs/compare/v9.11.0...v9.11.1) (2020-03-09)


### Bug Fixes

* concurrent write on LRU cache ([#200](https://github.com/harttle/liquidjs/issues/200)) ([6de9338](https://github.com/harttle/liquidjs/commit/6de9338))

# [9.11.0](https://github.com/harttle/liquidjs/compare/v9.10.0...v9.11.0) (2020-03-04)


### Bug Fixes

* `Buffer not defined` for browser bundles, fixes [#197](https://github.com/harttle/liquidjs/issues/197) ([65b849c](https://github.com/harttle/liquidjs/commit/65b849c))
* stable sort for undefined keys, fixes [#191](https://github.com/harttle/liquidjs/issues/191) ([f57156b](https://github.com/harttle/liquidjs/commit/f57156b))


### Features

* async cache.read()/write(), remove .has() ([61dac49](https://github.com/harttle/liquidjs/commit/61dac49))

# [9.10.0](https://github.com/harttle/liquidjs/compare/v9.9.0...v9.10.0) (2020-03-03)


### Features

* support json filter, closes [#192](https://github.com/harttle/liquidjs/issues/192) ([aa27a6c](https://github.com/harttle/liquidjs/commit/aa27a6c))
* with & for in `render` tag, closes [#195](https://github.com/harttle/liquidjs/issues/195) ([6ea6881](https://github.com/harttle/liquidjs/commit/6ea6881))

# [9.9.0](https://github.com/harttle/liquidjs/compare/v9.8.0...v9.9.0) (2020-03-02)


### Features

* move filters/tags to instances, fixes [#188](https://github.com/harttle/liquidjs/issues/188) ([df8a919](https://github.com/harttle/liquidjs/commit/df8a919))

# [9.8.0](https://github.com/harttle/liquidjs/compare/v9.7.2...v9.8.0) (2020-02-20)


### Features

* "today" when using date filter, fixes [#193](https://github.com/harttle/liquidjs/issues/193) ([185312d](https://github.com/harttle/liquidjs/commit/185312d))

## [9.7.2](https://github.com/harttle/liquidjs/compare/v9.7.1...v9.7.2) (2020-02-20)


### Bug Fixes

* add funding entry to show up in npm fund command ([40095a8](https://github.com/harttle/liquidjs/commit/40095a8))

## [9.7.1](https://github.com/harttle/liquidjs/compare/v9.7.0...v9.7.1) (2020-02-19)


### Bug Fixes

* update index.html ([22386b0](https://github.com/harttle/liquidjs/commit/22386b0))

# [9.7.0](https://github.com/harttle/liquidjs/compare/v9.6.2...v9.7.0) (2020-02-07)


### Bug Fixes

* expression and string literal parser, [#186](https://github.com/harttle/liquidjs/issues/186) ([fc0cf6f](https://github.com/harttle/liquidjs/commit/fc0cf6f))


### Features

* globals shared between tags, see [#185](https://github.com/harttle/liquidjs/issues/185) ([870e7ec](https://github.com/harttle/liquidjs/commit/870e7ec))

## [9.6.2](https://github.com/harttle/liquidjs/compare/v9.6.1...v9.6.2) (2020-01-10)


### Performance Improvements

* prevent multiple case evaluations ([807e840](https://github.com/harttle/liquidjs/commit/807e840))

## [9.6.1](https://github.com/harttle/liquidjs/compare/v9.6.0...v9.6.1) (2020-01-04)


### Bug Fixes

* add `this` to fs references in parseFile ([4b079c5](https://github.com/harttle/liquidjs/commit/4b079c5))

# [9.6.0](https://github.com/harttle/liquidjs/compare/v9.5.0...v9.6.0) (2019-12-15)


### Features

* full syntax for strftime, close [#177](https://github.com/harttle/liquidjs/issues/177) ([ba5ff3f](https://github.com/harttle/liquidjs/commit/ba5ff3f))

# [9.5.0](https://github.com/harttle/liquidjs/compare/v9.4.2...v9.5.0) (2019-12-12)


### Features

* nested property for the `where` filter, [#178](https://github.com/harttle/liquidjs/issues/178) ([60ec74f](https://github.com/harttle/liquidjs/commit/60ec74f))

## [9.4.2](https://github.com/harttle/liquidjs/compare/v9.4.1...v9.4.2) (2019-11-15)


### Bug Fixes

* reading .first, .last of Array, closes [#175](https://github.com/harttle/liquidjs/issues/175) ([f82da11](https://github.com/harttle/liquidjs/commit/f82da11))

## [9.4.1](https://github.com/harttle/liquidjs/compare/v9.4.0...v9.4.1) (2019-11-15)


### Bug Fixes

* remove node dependencies for esm bundle, see [#173](https://github.com/harttle/liquidjs/issues/173) ([04df929](https://github.com/harttle/liquidjs/commit/04df929))

# [9.4.0](https://github.com/harttle/liquidjs/compare/v9.3.1...v9.4.0) (2019-11-14)


### Features

* add ability to pass JSON context to CLI ([9504e4e](https://github.com/harttle/liquidjs/commit/9504e4e))

## [9.3.1](https://github.com/harttle/liquidjs/compare/v9.3.0...v9.3.1) (2019-11-09)


### Bug Fixes

* liquidjs command in /bin/liquid.js, fixes [#169](https://github.com/harttle/liquidjs/issues/169) ([0073b90](https://github.com/harttle/liquidjs/commit/0073b90))

# [9.3.0](https://github.com/harttle/liquidjs/compare/v9.2.0...v9.3.0) (2019-11-07)


### Features

* support require.resolve for lookup, see [#168](https://github.com/harttle/liquidjs/issues/168) ([2dd4355](https://github.com/harttle/liquidjs/commit/2dd4355))

## [9.1.1](https://github.com/harttle/liquidjs/compare/v9.1.0...v9.1.1) (2019-10-10)


### Performance Improvements

* add string flattening to reduce retained memory (node only) ([3ad512c](https://github.com/harttle/liquidjs/commit/3ad512c))

# [9.1.0](https://github.com/harttle/liquidjs/compare/v9.0.1...v9.1.0) (2019-10-07)


### Features

* alias getTemplate() to parseFile() ([6b83788](https://github.com/harttle/liquidjs/commit/6b83788))

## [9.0.1](https://github.com/harttle/liquidjs/compare/v9.0.0...v9.0.1) (2019-10-02)


### Bug Fixes

* `unless` content is not waited, fixes [#160](https://github.com/harttle/liquidjs/issues/160) ([d2c8d13](https://github.com/harttle/liquidjs/commit/d2c8d13))

# [9.0.0](https://github.com/harttle/liquidjs/compare/v8.5.3...v9.0.0) (2019-08-26)


### Bug Fixes

* break/continue omitting output before them, [#123](https://github.com/harttle/liquidjs/issues/123) ([ae45c46](https://github.com/harttle/liquidjs/commit/ae45c46))
* reactjs demo during yarn install, fixes [#145](https://github.com/harttle/liquidjs/issues/145) ([b65df44](https://github.com/harttle/liquidjs/commit/b65df44))


### Code Refactoring

* return value of Tag#render is no longer used ([8028f82](https://github.com/harttle/liquidjs/commit/8028f82))


### Features

* renderSync, parseAndRenderSync and renderFileSync, see [#48](https://github.com/harttle/liquidjs/issues/48) ([7fb01ad](https://github.com/harttle/liquidjs/commit/7fb01ad))


### Performance Improvements

* target to es6, fixes [#137](https://github.com/harttle/liquidjs/issues/137) ([3b9fc7e](https://github.com/harttle/liquidjs/commit/3b9fc7e))


### BREAKING CHANGES

* Tag#render now returns void, use emitter argument
to write rendered html.
* ship to Node.js 8, the dist/liquid.cjs.js (main) no longer
supports Node.js 6, other bundles are also provided via dist/liquid.esm.js, dist/liquid.js (ES5 umd) and liquid.min.js (minified ES5 umd)
* remove default export, now should be used like import
{Liquid} from 'liquidjs'

## [8.5.3](https://github.com/harttle/liquidjs/compare/v8.5.2...v8.5.3) (2019-08-25)


### Bug Fixes

* escape filter when input is undefined ([a00945c](https://github.com/harttle/liquidjs/commit/a00945c))

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

* at_least, at_most, sort_natural for [#132](https://github.com/harttle/liquidjs/issues/132) ([e6f5f1c](https://github.com/harttle/liquidjs/commit/e6f5f1c))

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

* use polymorphism instead duck test ([82d7673](https://github.com/harttle/liquidjs/commit/82d7673))

## [8.0.1](https://github.com/harttle/liquidjs/compare/v8.0.0...v8.0.1) (2019-03-22)


### Bug Fixes

* incorrect scope when using assign with for, fixes [#115](https://github.com/harttle/liquidjs/issues/115) ([defbb58](https://github.com/harttle/liquidjs/commit/defbb58))

# [8.0.0](https://github.com/harttle/liquidjs/compare/v7.5.1...v8.0.0) (2019-03-10)


### Code Refactoring

* use camelCase for JavaScript APIs ([64e0c87](https://github.com/harttle/liquidjs/commit/64e0c87))


### Features

* promise support for drops, working on [#65](https://github.com/harttle/liquidjs/issues/65) ([4a8088d](https://github.com/harttle/liquidjs/commit/4a8088d))


### BREAKING CHANGES

* Options and method names in JavaScript API are now renamed to camelCase, for a complete list see #109

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
