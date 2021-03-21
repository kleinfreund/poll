/**
 * Calls a given function and keeps calling it after the specified delay has passed.
 *
 * @param fn The function to call.
 * @param delay The delay (in milliseconds) to wait before calling the function again.
 * @param shouldStopPolling A callback function indicating whether to stop polling.
 */
export default async function poll(
  fn: () => any,
  delay: number,
  shouldStopPolling: () => boolean = () => false
) {
  if (typeof delay !== 'number') {
    throw new TypeError(
      `Expected “delay” to be of type number, but it was of type ${typeof delay}.`
    )
  }

  delay = Math.max(0, delay)

  do {
    await fn()

    if (shouldStopPolling()) {
      break
    }

    await new Promise(resolve => setTimeout(resolve, delay))
  } while (!shouldStopPolling())
}
