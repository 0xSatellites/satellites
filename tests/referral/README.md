# Referral regression tests

Install only these test dependencies with lifecycle scripts disabled, then run on Node 24:

```sh
cd tests/referral
npm install --ignore-scripts
npm test
```

An existing separate installation can be selected with `REFERRAL_TEST_DEPS=/absolute/directory` (the directory containing this dependency manifest and node_modules). This avoids installing the complete legacy app just to execute focused tests.

The tests use real pinned BigNumber 8.0.2, Vue 2.6.14, Vuex 3.1.1, Vue class/property decorators and TypeScript 3.5.3. The compiler loads the actual helper, middleware, state module and Buttons.vue script in memory. The component's existing `buy` boundary is replaced with a recording function. No provider, key, signature or live transaction is used.

Run the actual upstream component negative control from the repository root:

```sh
BASELINE_REF=<upstream-commit> node --test tests/referral/referral.test.cjs
```

This loads source using `git show` without overwriting worktree files. Only the component acceptance test runs in baseline mode. It should fail because the upstream method does not pass the referral recipient. The fixed suite covers URL validation, exact integer fee conservation above Number.MAX_SAFE_INTEGER, rounding, self/existing recipients, invalid configuration, zero/full share, actual middleware/Vuex visit state and actual Vue purchase-method arguments.

## Mounted browser fixture

With Bun and Playwright available, run from the repository root:

```sh
bun tests/referral/build-browser.cjs
PLAYWRIGHT_PACKAGE=/absolute/path/to/playwright/index.mjs node tests/referral/browser-check.cjs
```

Both commands honor `REFERRAL_TEST_DEPS`. `CHROME_PATH` can select an existing Chrome executable; otherwise Playwright's installed Chromium is used. `EVIDENCE_DIR` selects the screenshot directory. The generated browser bundle stays in the test dependency directory by default, not the production tree.

This fixture compiles the actual Buttons.vue template with vue-template-compiler 2.6.14 and its script with TypeScript 3.5.3, then mounts real Vue 2/Vuetify 1.5.24, Vuex and Vue Router. A router guard invokes the actual referral middleware to model Nuxt's middleware hook. Desktop/mobile scenarios navigate from a referral URL to an asset without a query, click the actual Buy button and check transaction-boundary parameters. Invalid/repeated query scenarios verify the original fee recipients remain. The fixture supplies an asset and authenticated address; the provider initialization plugin and complete application layout are not loaded. The real transaction method remains substituted and the fake explorer target is example.invalid.

This is not a complete Nuxt app build or full Nuxt lifecycle, complete TypeScript/lint gate, deployed distributor test or proof of chain settlement. Old app dependency compatibility and real EVM execution remain separate review boundaries. Browser build/test tooling and deprecated legacy Vue/Vuetify dependencies are isolated test-only dependencies; production dependencies are unchanged.
