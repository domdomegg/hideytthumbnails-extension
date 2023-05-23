// Polyfill for Chrome
// https://bugs.chromium.org/p/chromium/issues/detail?id=798169
if (typeof globalThis.browser === "undefined") {
  globalThis.browser = globalThis.chrome;
}

/**
 * @typedef {{
 *   syncSettings: boolean,
 *   thumbnailMode: 'hidden' | 'hidden-except-hover' | 'blurred' | 'normal' | 'solid-color',
 *   disabledOnPages: {
 *     results: boolean,
 *     playlist: boolean,
 *     watch: boolean,
 *     everywhere: boolean,
 *   },
 * }} Options
 */

const defaultOptions = {
  syncSettings: true,
  disabledOnPages: {
    results: false,
    playlist: false,
    watch: false,
    everywhere: false,
  },
  thumbnailMode: 'hidden',
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
