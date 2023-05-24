/**
 * Calls a given function and keeps calling it after the specified delay has passed.
 *
 * @param {() => any} fn The function to call.
 * @param {number | (() => number)} delayOrDelayCallback The delay (in milliseconds) to wait before calling the function again. Can be a function.
 * @param {() => boolean | Promise<boolean>} [shouldStopPolling] A callback function indicating whether to stop polling.
 * @returns {Promise<void>}
 */
export async function poll(fn, delayOrDelayCallback, shouldStopPolling = () => false) {
	do {
		await fn()

		if (await shouldStopPolling()) {
			break
		}

		const delay = typeof delayOrDelayCallback === 'number' ? delayOrDelayCallback : delayOrDelayCallback()
		await new Promise((resolve) => setTimeout(resolve, Math.max(0, delay)))
	} while (!await shouldStopPolling())
}
