# Contributing

1. Build everything and run tests to learn how to do both:
  - `npm run build`
  - `npm run test`

  Tests won't at first unless you've done a build at least once.
  Subsequent changes to tests do not need re-builds but changes to the code and
  then tests need a build to pick up the new code by the tests.

2. Make your changes and add a test for them
  - Build after you've made your changes
  - Run tests as per the above to validate your changes

3. Create a pull request
  - Ensure the build runs because the Husky pre-commit hook checks it
    - `npm run check` checks runs the build, tests, lint and perf tests
    - `commitlint` checks the commit message format

    If there is a problem you will see it in the pre-commit hook output.
    In VS Code, this output will be shown in a new file in a new tab if the
    pre-commit hook fails.
    If you want to check the commit message without using the VS Code Source
    Control UI, you can run `echo "feat: my commit message" > npx commitlint`
    directly.

  - `git switch -c your_branch_name` (do this in your fork not the main repo)
  - `git add .`
  - `git commit -m "feat: Adding my change"`
  - `git push`
  - Go to GitHub and find your fork, open a PR against the upstream from it

## Playground

The Playground runs off the `docs` directory.
`npm run build:docs` is used to build it.

Then, to start the site locally, go to `docs` and run `npm start`, then visit
http://localhost:4000/playground.html.

The Playground uses a local built LiquidJS, which is created during `npm run build:docs`.
To update that, you'll need to run `./bin/build-docs-liquid.sh` each time after making changes.
Then refresh the Playground site for the changes to take effect.

## Performance

If your change can have a performance impact, you can update and run performance cases under `benchmark/`.

1. `npm run build:cjs` to build a CommonJS bundle for the perf test.
2. `npm run perf:diff` to check whether there's a regression compared against `liquidjs@latest`

Further more, `benchmark/` contains different cases to check its ops/sec. Useful when debugging perf regressions, to use it:

- `cd benchmark` go into benchmark project
- `npm ci` install dependencies
- `npm start` run the cases
