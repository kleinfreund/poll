"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Calls a given function and keeps calling it after the specified delay has passed.
 *
 * @param {() => any} fn The function to call.
 * @param {number} delay The delay (in milliseconds) to wait before calling the function again.
 * @param {() => boolean} shouldStopPolling A callback function indicating whether to stop polling.
 */
async function poll(fn, delay, shouldStopPolling = () => false) {
    if (typeof delay !== 'number') {
        throw new TypeError(`Expected “delay” to be of type number, but it was of type ${typeof delay}.`);
    }
    delay = Math.max(0, delay);
    try {
        do {
            await fn();
            if (shouldStopPolling()) {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        } while (!shouldStopPolling());
    }
    catch (error) {
        throw error;
    }
}
exports.default = poll;
