// Polyfill for Chrome
// https://bugs.chromium.org/p/chromium/issues/detail?id=798169
if (typeof globalThis.browser === "undefined") {
  globalThis.browser = globalThis.chrome;
}

/**
 * @typedef {{
 *   syncSettings: boolean,
 *   thumbnailMode: 'hidden' | 'hidden-except-hover' | 'blurred' | 'solid-color' | 'normal',
 *   disabledOnPages: {
 *     results: boolean,
 *     channel: boolean,
 *     playlist: boolean,
 *     watch: boolean,
 *     subscriptions: boolean,
 *     everywhere: boolean,
 *   },
 * }} Options
 */

/** @type {Options} */
const defaultOptions = {
  syncSettings: true,
  disabledOnPages: {
    results: false,
    channel: false,
    playlist: false,
    watch: false,
    subscriptions: false,
    everywhere: false,
  },
  thumbnailMode: 'hidden',
  workMode: {
    enabled: false,
    startTime: "09:00",
    endTime: "17:00",
  },
}

/**
 * @returns {Promise<Options>}
 */
const loadOptions = async () => {
  /** @type {boolean} */
  const syncSettings = (await new Promise((resolve) => {
    browser.storage.local.get(defaultOptions, resolve);
  })).syncSettings ?? defaultOptions.syncSettings;

  const options = await new Promise((resolve) => {
    browser.storage[syncSettings ? 'sync' : 'local'].get(defaultOptions, resolve);
  })

  return { ...defaultOptions, ...options }
}
