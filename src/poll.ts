/**
 * Calls a given function and keeps calling it after the specified delay has passed.
 *
 * @param fn The function to call.
 * @param delay The delay (in milliseconds) to wait before calling the function again.
 * @param shouldStopPolling A callback function indicating whether to stop polling.
 */
export async function poll(
  fn: () => any,
  delay: number,
  shouldStopPolling: () => boolean | Promise<boolean> = () => false
): Promise<void> {
  delay = Math.max(0, delay)

  do {
    await fn()

    if (await shouldStopPolling()) {
      break
    }

    await new Promise(resolve => setTimeout(resolve, delay))
  } while (!await shouldStopPolling())
}
