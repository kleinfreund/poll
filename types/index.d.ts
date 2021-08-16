/**
 * Calls a given function and keeps calling it after the specified delay has passed.
 *
 * @param fn The function to call.
 * @param delay The delay (in milliseconds) to wait before calling the function again.
 * @param shouldStopPolling A callback function indicating whether to stop polling.
 */
export declare function poll(
  fn: () => any,
  delay: number,
  shouldStopPolling: () => boolean
): Promise<void>
