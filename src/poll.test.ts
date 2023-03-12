import { poll } from './poll.js'

/**
 * Advances the jest timers by the polling delay and any artificial delay introduced via the `shouldStopPolling` callback function if it’s asynchronous.
 *
 * @param numberOfIterations
 * @param delay
 * @param shouldStopPollingDelay
 */
async function advanceJestTimersByPollCycles(
	numberOfIterations: number,
	delayOrDelayCallback: number | (() => number),
	shouldStopPollingDelay: number = 0
): Promise<void> {
	for (let i = 0; i < numberOfIterations; i++) {
		// Clear micro task queue for awaiting `fn`
		await Promise.resolve()

		// Advance timers for asynchronous `shouldStopPolling` routine
		jest.advanceTimersByTime(shouldStopPollingDelay)
		// Clear micro task queue for awaiting `shouldStopPolling`
		await Promise.resolve()

		const delay = typeof delayOrDelayCallback === 'function' ? delayOrDelayCallback() : delayOrDelayCallback
		jest.advanceTimersByTime(delay)
		// Clear micro task queue for awaiting polling delay setTimeout call
		await Promise.resolve()

		// Advance timers for asynchronous `shouldStopPolling` routine
		jest.advanceTimersByTime(shouldStopPollingDelay)
		// Clear micro task queue for awaiting `shouldStopPolling`
		await Promise.resolve()
	}
}

describe('poll', () => {
	beforeEach(() => {
		jest.useFakeTimers()
	})

	afterEach(() => {
		jest.runAllTimers()
		jest.useRealTimers()
	})

	test('throws error when polled function throws error', async () => {
		function fn() {
			throw new Error('I’m not happy with the overall situation.')
		}

		const pollPromise = poll(fn, 25)

		await expect(pollPromise).rejects.toThrow(Error)
	})

	test('works with synchronous function', async () => {
		const fn = jest.fn()
		const delay = 50
		poll(fn, delay)

		// The first call happens immediately before any timers run.
		expect(fn).toHaveBeenCalledTimes(1)

		const numberOfIterations = 3
		await advanceJestTimersByPollCycles(numberOfIterations, delay)

		// Advancing the jest timers `numberOfIterations` times by the `delay` should also add `numberOfIterations` times more calls to the callback function.
		expect(fn).toHaveBeenCalledTimes(1 + numberOfIterations)
	})

	test('works with asynchronous function', async () => {
		let pollingShouldBeStopped = false
		const shouldStopPolling = () => pollingShouldBeStopped

		const fn = jest.fn().mockImplementation(async () => { })
		const delay = 50
		poll(fn, delay, shouldStopPolling)

		// The first call happens immediately before any timers run.
		expect(fn).toHaveBeenCalledTimes(1)

		const numberOfIterations = 3
		await advanceJestTimersByPollCycles(numberOfIterations, delay)

		// Advancing the jest timers `numberOfIterations` times by the `delay` should also add `numberOfIterations` times more calls to the callback function.
		expect(fn).toHaveBeenCalledTimes(1 + numberOfIterations)

		pollingShouldBeStopped = true
	})

	test('can be stopped synchronously', async () => {
		let pollingShouldBeStopped = false
		const shouldStopPolling = () => pollingShouldBeStopped

		const fn = jest.fn()
		const delay = 50
		poll(fn, delay, shouldStopPolling)

		expect(fn).toHaveBeenCalledTimes(1)

		await advanceJestTimersByPollCycles(1, delay)

		expect(fn).toHaveBeenCalledTimes(2)

		// Disabling this should make the test fail because after completing another cycle, the polling function will have been called a third time which is what is asserted at the end of the test.
		pollingShouldBeStopped = true

		await advanceJestTimersByPollCycles(1, delay)

		expect(fn).toHaveBeenCalledTimes(2)
	})

	test('can be stopped asynchronously', async () => {
		let pollingShouldBeStopped = false
		const shouldStopPollingDelay = 100
		const shouldStopPolling = () => new Promise<boolean>((resolve) => {
			setTimeout(() => {
				resolve(pollingShouldBeStopped)
			}, shouldStopPollingDelay)
		})

		const fn = jest.fn()
		const delay = 50
		poll(fn, delay, shouldStopPolling)

		expect(fn).toHaveBeenCalledTimes(1)

		await advanceJestTimersByPollCycles(1, delay, shouldStopPollingDelay)

		expect(fn).toHaveBeenCalledTimes(2)

		// Disabling this should make the test fail because after completing another cycle, the polling function will have been called a third time which is what is asserted at the end of the test.
		pollingShouldBeStopped = true
		await advanceJestTimersByPollCycles(1, delay, shouldStopPollingDelay)

		expect(fn).toHaveBeenCalledTimes(2)
	})

	test('accepts delay function (exponential backoff)', async () => {
		const fn = jest.fn()
		let delay = 50
		const delayCallback = () => {
			delay *= 2
			return delay
		}
		poll(fn, delayCallback)

		// The first call happens immediately before any timers run.
		expect(fn).toHaveBeenCalledTimes(1)

		const numberOfIterations = 3
		await advanceJestTimersByPollCycles(numberOfIterations, () => delay)

		// Advancing the jest timers `numberOfIterations` times by the `delay` should also add `numberOfIterations` times more calls to the callback function.
		expect(fn).toHaveBeenCalledTimes(1 + numberOfIterations)
	})
})
