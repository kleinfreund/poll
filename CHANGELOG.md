# Changelog

## [3.2.2](https://github.com/kleinfreund/poll/compare/v3.2.1...v3.2.2) (2023-05-18)

### Bug fixes

- Fixes `pkg.exports` missing types for bare module specifiers (i.e. imports from `poll`).
- Adds missing entry for the type definition file (can now be imported `poll/types/index.d.ts` without TypeScript complaining).

## [3.2.1](https://github.com/kleinfreund/poll/compare/v3.2.0...v3.2.1) (2022-10-18)

### Bug fixes

- Fixes the type for `poll` incorrectly marking the `shouldStopPolling` argument as required.

## [3.2.0](https://github.com/kleinfreund/poll/compare/v3.1.0...v3.2.0) (2021-11-27)

### Features

- Adds support for providing a delay function which returns the delay value allowing customization of the polling interval. This can be utilized to implement polling with exponential backoff (i.e. where the polling interval steadily increases over time).

## [3.1.0](https://github.com/kleinfreund/poll/compare/v3.0.0...v3.1.0) (2021-11-13)

### Features

- Adds support for asynchronous `shouldStopPolling` functions.

## [3.0.0](https://github.com/kleinfreund/poll/compare/v2.0.1...v3.0.0) (2021-08-16)

### Breaking changes

- Changes the package’s distribution format from UMD to ES module.
- Changes the exported `poll` function from a default export to a named export. Update your code by replacing `import poll from 'poll'` with `import { poll } from 'poll'`.

## [2.0.1](https://github.com/kleinfreund/poll/compare/v2.0.0...v2.0.1) (2021-03-27)

### Bug fixes

- Fixes incorrect usage instructions in README.md file.

## [2.0.0](https://github.com/kleinfreund/poll/compare/v1.0.1...v2.0.0) (2021-03-21)

### Breaking changes

- Removes the separate ESM and CJS bundles in favour of one UMD bundle that can be used more easily in most scenarios while keeping the bundle size down. The bundle in the dist directory is now also minified.

## [1.0.1](https://github.com/kleinfreund/poll/compare/v1.0.0...v1.0.1) (2019-08-23)

### Bug fixes

- Removes safe guard preventing use of `poll` function with negative `delay` values.

## [1.0.0](https://github.com/kleinfreund/poll/compare/v0.1.0...v1.0.0) (2019-08-04)

### Breaking changes

- Importing the CommonJS module with `require('poll')` no longer resolves to the `poll` function. Use `require('poll').default` instead.

  ```node
  const poll = require('poll').default;
  ```

**Non-breaking changes**:

- The package is now available as an ES module. If you use `poll` as a dependency, import it like this:

  ```js
  import poll from 'poll/dist/esm/poll.mjs';
  ```

- Tests now use Jest instead of Ava.
- Tests are now based on fake timers instead of calling `setTimeout` in the tests directly. Unfortunately, tests still require a lot of trickery to manually clear out the promise queue. If you know how to test this without sprinkling `await Promise.resolve()` all over my tests, I’m all ears!

## 0.1.0 (2019-08-03)

### Features

- Releases initial version of the poll package.
