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

This is not a complete Nuxt app build, mounted template/browser test, full TypeScript gate, deployed distributor test or proof of chain settlement. Old app dependency compatibility and real EVM execution remain separate review boundaries.
