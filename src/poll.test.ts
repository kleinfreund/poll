import { poll } from './poll'

describe('poll', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runAllTimers()
    jest.useRealTimers()
  })

  test('… works with synchronous function', async () => {
    const fn = jest.fn()
    const delay = 50
    poll(fn, delay)

    // The first call happens immediately before any timers run.
    expect(fn).toHaveBeenCalledTimes(1)

    const numberOfIterations = 3
    for (let i = 0; i < numberOfIterations; i++) {
      await Promise.resolve()
      await Promise.resolve()
      jest.advanceTimersByTime(delay)
      await Promise.resolve()
      await Promise.resolve()
    }

    // Advancing the jest timers `numberOfIterations` times by the `delay` should also add `numberOfIterations` times more calls to the callback function.
    expect(fn).toHaveBeenCalledTimes(1 + numberOfIterations)
  })

  test('… works with asynchronous function', async () => {
    let pollingShouldBeStopped = false
    const shouldStopPolling = () => pollingShouldBeStopped

    const fn = jest.fn().mockImplementation(async () => { })
    const delay = 50
    poll(fn, delay, shouldStopPolling)

    // The first call happens immediately before any timers run.
    expect(fn).toHaveBeenCalledTimes(1)

    const numberOfIterations = 3
    for (let i = 0; i < numberOfIterations; i++) {
      await Promise.resolve()
      await Promise.resolve()
      jest.advanceTimersByTime(delay)
      await Promise.resolve()
      await Promise.resolve()
    }

    // Advancing the jest timers `numberOfIterations` times by the `delay` should also add `numberOfIterations` times more calls to the callback function.
    expect(fn).toHaveBeenCalledTimes(1 + numberOfIterations)

    pollingShouldBeStopped = true
  })

  test('… can be stopped synchronously', async () => {
    let pollingShouldBeStopped = false
    const shouldStopPolling = () => pollingShouldBeStopped

    const fn = jest.fn()
    const delay = 50
    poll(fn, delay, shouldStopPolling)

    expect(fn).toHaveBeenCalledTimes(1)

    // Clear micro task queue for awaiting `fn`
    await Promise.resolve()

    // Clear micro task queue for awaiting `shouldStopPolling`
    await Promise.resolve()

    // Advance timers for polling delay routine
    jest.advanceTimersByTime(delay)
    // Clear micro task queue for awaiting polling delay setTimeout call
    await Promise.resolve()

    // Clear micro task queue for awaiting `shouldStopPolling`
    await Promise.resolve()

    // The polling function now completed 1 cycle

    expect(fn).toHaveBeenCalledTimes(2)

    // Clear micro task queue for awaiting `fn`
    await Promise.resolve()

    // Disabling this should make the test fail because after completing another cycle, the polling function will have been called a third time which is what is asserted at the end of the test.
    pollingShouldBeStopped = true

    // Advance timers for 2 asynchronous `shouldStopPolling` routines and 1 polling delay routine to pass another complete cycle:

    // Clear micro task queue for awaiting `shouldStopPolling`
    await Promise.resolve()

    // Advance timers for polling delay routine
    jest.advanceTimersByTime(delay)
    // Clear micro task queue for awaiting polling delay setTimeout call
    await Promise.resolve()

    // Clear micro task queue for awaiting `shouldStopPolling`
    await Promise.resolve()

    // The polling function now completed 2 cycles

    expect(fn).toHaveBeenCalledTimes(2)
  })

  test('… can be stopped asynchronously', async () => {
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

    // Clear micro task queue for awaiting `fn`
    await Promise.resolve()

    // Advance timers for asynchronous `shouldStopPolling` routine
    jest.advanceTimersByTime(shouldStopPollingDelay)
    // Clear micro task queue for awaiting `shouldStopPolling`
    await Promise.resolve()

    // Advance timers for polling delay routine
    jest.advanceTimersByTime(delay)
    // Clear micro task queue for awaiting polling delay setTimeout call
    await Promise.resolve()

    // Advance timers for asynchronous `shouldStopPolling` routine
    jest.advanceTimersByTime(shouldStopPollingDelay)
    // Clear micro task queue for awaiting `shouldStopPolling`
    await Promise.resolve()

    // The polling function now completed 1 cycle

    expect(fn).toHaveBeenCalledTimes(2)

    // Clear micro task queue for awaiting `fn`
    await Promise.resolve()

    // Disabling this should make the test fail because after completing another cycle, the polling function will have been called a third time which is what is asserted at the end of the test.
    pollingShouldBeStopped = true

    // Advance timers for 2 asynchronous `shouldStopPolling` routines and 1 polling delay routine to pass another complete cycle:

    // Advance timers for asynchronous `shouldStopPolling` routine
    jest.advanceTimersByTime(shouldStopPollingDelay)
    // Clear micro task queue for awaiting `shouldStopPolling`
    await Promise.resolve()

    // Advance timers for polling delay routine
    jest.advanceTimersByTime(delay)
    // Clear micro task queue for awaiting polling delay setTimeout call
    await Promise.resolve()

    // Advance timers for asynchronous `shouldStopPolling` routine
    jest.advanceTimersByTime(shouldStopPollingDelay)
    // Clear micro task queue for awaiting `shouldStopPolling`
    await Promise.resolve()

    // The polling function now completed 2 cycles

    expect(fn).toHaveBeenCalledTimes(2)
  })

  test('… throws error when polled function throws error', async () => {
    function fn() {
      throw new Error('I’m not happy with the overall situation.')
    }

    const pollRef = poll(fn, 25)

    await expect(pollRef).rejects.toThrow(Error)
  })
})
