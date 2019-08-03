# poll

A simple poll function based on async, await, and an infinite loop.

Links:

- [**npmjs.com**/package/poll](https://www.npmjs.com/package/poll)
- [**github.com**/kleinfreund/poll](https://github.com/kleinfreund/poll)



## Table of contents

- [Installation](#installation)
- [Tests](#tests)
- [Documentation](#documentation)
- [Usage](#usage)



## Installation

Install the NPM package as a dependency …

```sh
npm install --save poll
```

… and import it like this:

```node
const poll = require('poll');

function fn() {
  console.log('Hello, beautiful!');
};

poll(fn, 1000);
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
- **delay**: Required. The delay (in milliseconds) to wait before calling the function again.
- **shouldStopPolling**: Optional. A function indicating whether to stop the polling process. The callback function is evaluated twice during one iteration of the internal loop:
  - After the result of the call to `function` was successfully awaited. In other words, right before triggering a new delay period.
  - After the `delay` has passed. In other words, right before calling `function` again.

  This guarantees two things:
  - A currently active execution of `function` will be completed.
  - No new calls to `function` will be triggered.

**Return value**:

None.
