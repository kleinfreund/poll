# poll

A simple poll function based on async, await, and an infinite loop.

Links:

- [**npmjs.com**/package/poll](https://www.npmjs.com/package/poll)
  - [on BundlePhobia](https://bundlephobia.com/result?p=poll)
- [**github.com**/kleinfreund/poll](https://github.com/kleinfreund/poll)



## Table of contents

- [Installation](#installation)
- [Tests](#tests)
- [Documentation](#documentation)
- [Examples](#examples)



## Installation

### Browser

Download the UMD bundle file …

```sh
curl -O https://raw.githubusercontent.com/kleinfreund/poll/main/dist/poll.js
```

… and use it like this:

```js
const poll = window.poll.default

function fn() {
  console.log('Hello, beautiful!')
}

poll(fn, 1000)
```

### Node

Install the npm package as a dependency …

```sh
npm install poll
```

… and import it like this:

- CommonJS module

  ```js
  const poll = require('poll').default

  function fn() {
    console.log('Hello, beautiful!')
  }

  poll(fn, 1000)
  ```

- ES module

  ```js
  import poll from 'poll/dist/poll.js'

  function fn() {
    console.log('Hello, beautiful!')
  }

  poll(fn, 1000)
  ```



## Tests

In order to run the tests, clone the repository and run the following commands:

```sh
npm install
npm test
```



## Documentation

### Syntax

```
poll(function, delay[, shouldStopPolling])
```

**Parameters**:

- **function**: Required. A function to be called every `delay` milliseconds. No parameters are passed to `function` upon calling it.
- **delay**: Required. The delay (in milliseconds) to wait before calling the function again. If `delay` is negative, zero will be used instead.
- **shouldStopPolling**: Optional. A function indicating whether to stop the polling process. The callback function is evaluated twice during one iteration of the internal loop:
  - After the result of the call to `function` was successfully awaited. In other words, right before triggering a new delay period.
  - After the `delay` has passed. In other words, right before calling `function` again.

  This guarantees two things:
  - A currently active execution of `function` will be completed.
  - No new calls to `function` will be triggered.

**Return value**:

None.



## Examples

The `poll` function expects two parameters: A callback function and a delay. After calling `poll` with these parameters, the callback function will be called. After it’s done being executed, the `poll` function will wait for the specified `delay`. After the delay, the process starts from the beginning.

```js
const pollDelayInMinutes = 10

async function getStatusUpdates() {
  const response = await fetch('/status')
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
