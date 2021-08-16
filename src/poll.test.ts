import poll from './poll'

describe('poll', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runAllTimers()
    jest.useRealTimers()
  })

  test('… works with asynchronous function', async () => {
    jest.spyOn(window, 'setTimeout')
    let pollingShouldBeStopped = false
    const shouldStopPolling = () => pollingShouldBeStopped

    const fn = jest.fn().mockImplementation(async () => { })
    poll(fn, 50, shouldStopPolling)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(setTimeout).not.toHaveBeenCalled()

    const numberOfIterations = 3
    for (let i = 0; i < numberOfIterations; i++) {
      await Promise.resolve()
      jest.advanceTimersByTime(50)
      await Promise.resolve()
    }

    expect(fn).toHaveBeenCalledTimes(1 + numberOfIterations)
    expect(setTimeout).toHaveBeenCalledTimes(numberOfIterations)

    pollingShouldBeStopped = true
  })

  test('… works with synchronous function', async () => {
    jest.spyOn(window, 'setTimeout')
    let pollingShouldBeStopped = false
    const shouldStopPolling = () => pollingShouldBeStopped

    const fn = jest.fn()
    poll(fn, 50, shouldStopPolling)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(setTimeout).not.toHaveBeenCalled()

    const numberOfIterations = 3
    for (let i = 0; i < numberOfIterations; i++) {
      await Promise.resolve()
      jest.advanceTimersByTime(50)
      await Promise.resolve()
    }

    expect(fn).toHaveBeenCalledTimes(1 + numberOfIterations)
    expect(setTimeout).toHaveBeenCalledTimes(numberOfIterations)

    pollingShouldBeStopped = true
  })

  test('… can be stopped', async () => {
    jest.spyOn(window, 'setTimeout')
    let pollingShouldBeStopped = false
    const shouldStopPolling = () => pollingShouldBeStopped

    const fn = jest.fn()
    poll(fn, 50, shouldStopPolling)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(setTimeout).not.toHaveBeenCalled()

    const numberOfIterations = 3
    for (let i = 0; i < numberOfIterations; i++) {
      await Promise.resolve()
      jest.advanceTimersByTime(50)
      await Promise.resolve()
    }

    expect(fn).toHaveBeenCalledTimes(1 + numberOfIterations)
    expect(setTimeout).toHaveBeenCalledTimes(numberOfIterations)

    pollingShouldBeStopped = true

    for (let i = 0; i < numberOfIterations; i++) {
      await Promise.resolve()
      jest.runOnlyPendingTimers()
      await Promise.resolve()
    }

    expect(fn).toHaveBeenCalledTimes(1 + numberOfIterations)
    expect(setTimeout).toHaveBeenCalledTimes(numberOfIterations)
  })

  test('… throws error when polled function throws error', async () => {
    function fn() {
      throw new Error('I’m not happy with the overall situation.')
    }

    const pollRef = poll(fn, 25)

    await expect(pollRef).rejects.toThrow(Error)
  })
})
