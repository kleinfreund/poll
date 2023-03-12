/**
 * Calls a given function and keeps calling it after the specified delay has passed.
 */
export declare function poll(
	/**
	 * The function to call.
	 */
	fn: () => any,

	/**
	 * The delay (in milliseconds) to wait before calling the function again. Can be a function.
	 */
	delayOrDelayCallback: number | (() => number),

	/**
	 * A callback function indicating whether to stop polling.
	 */
	shouldStopPolling?: () => boolean | Promise<boolean>
): Promise<void>
