/**
 * Calls a given function and keeps calling it after the specified delay has passed.
 *
 * @param {() => any} fn The function to call.
 * @param {Number} delay The delay (in milliseconds) to wait before calling the function again.
 * @param {() => Boolean} shouldStopPolling A callback function indicating whether to stop polling.
 */
async function poll(
  fn: () => any,
  delay: Number,
  shouldStopPolling: () => Boolean = () => false
) {
  if (typeof delay !== 'number') {
    throw new TypeError(
      `Expected “delay” to be of type number, but it was of type ${typeof delay}.`
    );
  } else if (delay < 0) {
    throw new RangeError(
      `Expected “delay” to be a non-negative number, but it was “${delay}”.`
    );
  }

  try {
    do {
      await fn();

      if (shouldStopPolling()) {
        break;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    } while (!shouldStopPolling());
  } catch (error) {
    throw error;
  }
}

export default poll;
