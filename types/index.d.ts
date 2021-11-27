/**
 * Calls a given function and keeps calling it after the specified delay has passed.
 *
 * @param fn The function to call.
 * @param delayOrDelayCallback The delay (in milliseconds) to wait before calling the function again. Can be a function.
 * @param shouldStopPolling A callback function indicating whether to stop polling.
 */
export declare function poll(
  fn: () => any,
  delayOrDelayCallback: number | (() => number),
  shouldStopPolling: () => boolean | Promise<boolean>
): Promise<void>
