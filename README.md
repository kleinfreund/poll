# poll

A simple poll function based on async, await, and an infinite loop.

**Features**:

- Asynchronous callback function
- Delay function to customize the polling interval (e.g. to implement exponential backoff)
- Cancellation function to stop polling altogether (e.g. stop polling after 10 cycles or once a certain condition is fulfilled)

**Links**:

- [**npmjs.com**/package/poll](https://www.npmjs.com/package/poll)
	- [on BundlePhobia](https://bundlephobia.com/result?p=poll)
- [**github.com**/kleinfreund/poll](https://github.com/kleinfreund/poll)

## Contents

- [Installation & usage](#installation-&-usage)
	- [As npm package](#as-npm-package)
	- [As plain JS file](#as-plain-js-file)
- [Documentation](#documentation)
	- [Syntax](#syntax)
- [Examples](#examples)
	- [Minimal](#minimal)
	- [Stop polling](#stop-polling)
	- [Stop polling using asynchronous `shouldStopPolling` function](#stop-polling-using-asynchronous-shouldstoppolling-function)
	- [Exponential backoff: increase polling interval with every cycle](#exponential-backoff-increase-polling-interval-with-every-cycle)
- [Versioning](#versioning)
- [Update package version](#update-package-version)

## Installation & usage

### As npm package

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

### As plain JS file

1. Download the `poll` module.

	```sh
	curl -O 'https://cdn.jsdelivr.net/npm/poll@latest/dist/poll.js'
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
- **Name**: `delayOrDelayCallback`<br>
	**Type**: `number | (() => number)`<br>
	**Required**: Yes<br>
	**Description**: The delay (in milliseconds) to wait before calling the function `fn` again. If a function is provided instead of a number, it is evaluated during every polling cycle right before the wait period. If the delay is a negative number, zero will be used instead.
- **Name**: `shouldStopPolling`<br>
	**Type**: `() => boolean | Promise<boolean>`<br>
	**Required**: No<br>
	**Default**: `() => false`<br>
	**Description**: A function (or a promise resolving to a function) indicating whether to stop the polling process by returning a truthy value (e.g. `true`). The `shouldStopPolling` callback function is called twice during one polling cycle:

	- After the result of the call to `fn` was successfully awaited (right before triggering a new delay period).
	- After the `delay` has passed (right before calling `fn` again).

	This guarantees two things:

	- A currently active execution of `fn` will be completed.
	- No new calls to `fn` will be triggered.

**Return value**:

None.

## Examples

### Minimal

The `poll` function expects two parameters: A callback function and a delay. After calling `poll` with these parameters, the callback function will be called. After it’s done being executed, the `poll` function will wait for the specified `delay`. After the delay, the process starts from the beginning.

```js
const pollDelayInMinutes = 10

async function getStatusUpdates() {
	const pokemonId = Math.floor(Math.random() * 151 + 1)
	const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
	const pokemon = await response.json()
	console.log(pokemon.name)
}

poll(getStatusUpdates, pollDelayInMinutes * 60 * 1000)
```

Note that `poll` will not cause a second call to the callback function if the first call is never finishing. For example, if the endpoint `/status` does not respond and the server doesn’t time out the connection, `poll` will still be waiting for the callback function to resolve until the dusk of time.

### Stop polling

You can pass a callback function to `poll` for its third parameter. It’s evaluated before and after calls to the polled function. If it evaluates to a truthy value, the `poll` function’s loop will stop and the function returns.

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

In this example, the `shouldStopPolling` callback function evaluates to `true` after the `setTimeout` function causes `stopPolling` to be set to `true` after 1000 milliseconds. The next time `shouldStopPolling` is evaluated, it will cause `poll` to exit normally.

### Stop polling using asynchronous `shouldStopPolling` function

You can also provide an asynchronous function for the `shouldStopPolling` callback function.

```js
let stopPolling = false
const shouldStopPolling = () => new Promise((resolve) => {
	setTimeout(() => {
		resolve(stopPolling)
	}, 100)
})

function fn() {
	console.log('Hello, beautiful!')
}

setTimeout(() => {
	stopPolling = true
}, 1000)

poll(fn, 50, shouldStopPolling)
```

Beware that this function will be called *twice* per polling cycle.

### Exponential backoff: increase polling interval with every cycle

By providing a function that returns the delay value instead of the delay value itself, you can customize the behavior of the polling interval. In the following example, the delay doubles with each polling cycle.

```js
const pollDelayInMinutes = 1
let delay = pollDelayInMinutes * 60 * 1000

const startTime = Date.now()

async function getStatusUpdates() {
	const pokemonId = Math.floor(Math.random() * 151 + 1)
	const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
	const pokemon = await response.json()
	const seconds = (Date.now() - startTime) / 1000
	console.log('Seconds passed:', seconds, pokemon.name)
}

const delayCallback = () => {
	const currentDelay = delay
	delay *= 2
	return currentDelay
}

poll(getStatusUpdates, delayCallback)
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
