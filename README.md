# poll

A simple poll function based on async, await, and an infinite loop.

Links:

- [**npmjs.com**/package/poll](https://www.npmjs.com/package/poll)
  - [on BundlePhobia](https://bundlephobia.com/result?p=poll)
- [**github.com**/kleinfreund/poll](https://github.com/kleinfreund/poll)

## Contents

- [Installation & usage](#installation--usage)
- [Documentation](#documentation)
- [Examples](#examples)
- [Versioning](#versioning)
- [Update package version](#update-package-version)

## Installation & usage

### npm package

1. Install the `poll` package.

   ```sh
   npm install poll
   ```

2. Import the `poll` function and use it.

   ```js
   // “poll” is mapped to “poll/dist/poll.js” by Node.js via the package’s “exports” field.
   import { poll } from 'poll'

   function fn() {
     console.log('Hello, beautiful!')
   }

   poll(fn, 1000)
   ```

### Plain file

1. Download the `poll` module.

   ```sh
   curl -O https://raw.githubusercontent.com/kleinfreund/poll/main/dist/poll.js
   ```

2. Import the `poll` function and use it.

   ```html
   <script type="module">
     import { poll } from './poll.js'

     function fn() {
       console.log('Hello, beautiful!')
     }

     poll(fn, 1000)
   </script>
   ```

## Documentation

### Syntax

```
poll(function, delay[, shouldStopPolling])
```

**Parameters**:

- **Name**: `fn`<br>
  **Type**: `() => any`<br>
  **Required**: Yes<br>
  **Description**: A function to be called every `delay` milliseconds. No parameters are passed to `fn` upon calling it.
- **Name**: `delay`<br>
  **Type**: `number`<br>
  **Required**: Yes<br>
  **Description**: The delay (in milliseconds) to wait before calling the function again. If `delay` is negative, zero will be used instead.
- **Name**: `shouldStopPolling`<br>
  **Type**: `() => boolean | Promise<boolean>`<br>
  **Required**: No<br>
  **Default**: `() => false`<br>
  **Description**: A function (or a promise resolving to a function) indicating whether to stop the polling process by returning a truthy value (e.g. `true`). The `shouldStopPolling` callback function is evaluated twice during one polling cycle:

  - After the result of the call to `fn` was successfully awaited (right before triggering a new delay period).
  - After the `delay` has passed (right before calling `fn` again).

  This guarantees two things:

  - A currently active execution of `fn` will be completed.
  - No new calls to `fn` will be triggered.

**Return value**:

None.

## Examples

The `poll` function expects two parameters: A callback function and a delay. After calling `poll` with these parameters, the callback function will be called. After it’s done being executed, the `poll` function will wait for the specified `delay`. After the delay, the process starts from the beginning.

```js
const pollDelayInMinutes = 10

async function getStatusUpdates() {
  const response = await fetch('/api/status')
  console.log(response)
}

poll(getStatusUpdates, pollDelayInMinutes * 60 * 1000)
```

Note that `poll` will not cause a second call to the callback function if the first call is still not finished. For example, it the endpoint `/status` does not respond and the server doesn’t time out the connection, `poll` will still be waiting for the callback function to fully resolve. It will not start the delay until the callback function is finished.

### Stop polling

You can pass a callback function to `poll` for its last parameter. Its evaluated before and after calls to the polled function. If it evaluates to `true`, the `poll` function’s loop will stop and the function returns.

In the following example, the `shouldStopPolling` callback function evaluates to `true` after the `setTimeout` function called its anonymous callback function which sets `stopPolling` to `true`. The next time `shouldStopPolling` is evaluated, it will cause `poll` to exit normally.

```js
let stopPolling = false
const shouldStopPolling = () => stopPolling

function fn() {
  console.log('Hello, beautiful!')
}

setTimeout(() => {
  stopPolling = true
}, 1000)

poll(fn, 50, shouldStopPolling)
```

## Versioning

This package uses [semantic versioning](https://semver.org).

## Update package version

1. Make some changes and run the tests and the build script.

   ```sh
   npm test
   npm run build
   ```

2. Commit the changes.
3. Verify that you’re authenticated with npm.

   ```sh
   npm whomai
   ```

   If you’re not authenticated, do so using `npm login`.

4. Change the package’s version locally.

   ```sh
   # See `npm version --help` for more options
   npm version minor
   ```

   This changes the version number in the package.json file and adds a new git tag matching the new version.

5. Push your changes and the updated git tags separately.

   ```sh
   git push
   git push --tags
   ```

6. Publish the package.

   ```sh
   npm publish
   ```
