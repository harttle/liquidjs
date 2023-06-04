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
  
  - Ensue `package-lock.json` is using the lockfile format version 1

    This only applies if your change introduces new NPM dependencies.
    This package maintains compatibility with Node 14+ and the corresponding NPM
    version.
    If you are using newer Node/NPM version, it will likely create a lockfile v2
    or v3.
    Convert to lockfile v1 using the following command before creating a PR:
    `npm install --lockfile-version 1 --package-lock-only`

  - `git switch -c your_branch_name` (do this in your fork not the main repo)
  - `git add .`
  - `git commit -m "feat: Adding my change"`
  - `git push`
  - Go to GitHub and find your fork, open a PR against the upstream from it

## Playground

The Playground runs off the `docs` directory.
`npm run:docs` is used to build it and that's included in `npm run build`.

To start the site locally, go to `docs` and run `npm start`, then visit
http://localhost:4000/playground.html.

At the moment, the Playground uses the latest NPM version of the LiquidJS
library instead of using the built artifact produced by `npm run build:dist`
(also included in `npm run build`).

To use the Playground with the local build of the library, make these changes:

- Copy `dist/liquid.browser.min.js` to `docs/public/js/liquid.browser.min.js`
- Open `docs/themes/navy/layout/partial/after_footer.swig`
- Remove `https://cdn.jsdelivr.net/npm/liquidjs/dist/liquid.browser.min.js` line
- Add `{{ js('liquid.browser.min.js') }}` line before `{{ js('js/main') }}` line
- Refresh the Playground site for the changes to take effect
- Replace `liquid.browser.min.js` each time after making changes and building

```diff
 {% if page.layout === 'playground' %}
-<script src="https://cdn.jsdelivr.net/npm/liquidjs/dist/liquid.browser.min.js"></script>
 <script src="https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-min/ace.js"></script>
 {% endif %}
 
+{{ js('js/liquid.browser.min.js') }}
 {{ js('js/main') }}
 
 <script src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"></script>
```
