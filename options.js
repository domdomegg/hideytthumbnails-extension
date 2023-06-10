/** @typedef {import("./common")} */

document.addEventListener('DOMContentLoaded', async () => {
  // Localize page
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const translated = browser.i18n.getMessage(elem.dataset.i18n);
    if (translated) {
      elem.innerText = translated;
    }
  })

  // Load existing settings
  const options = await loadOptions();
  //Settings storage
  document.forms[0].syncSettings.checked = options.syncSettings;
  
  //Thumbnail mode
  document.forms[0].thumbnailMode.value = options.thumbnailMode;
  
  //Disabled pages
  document.forms[0].disableSearchResultPage.checked = options.disabledOnPages.results;
  document.forms[0].disablePlaylistPage.checked = options.disabledOnPages.playlist;
  document.forms[0].disableWatchPage.checked = options.disabledOnPages.watch;
  document.forms[0].disableSubscriptionsPage.checked = options.disabledOnPages.subscriptions;
  document.forms[0].disableEverywhere.checked = options.disabledOnPages.everywhere;
  
  //Work Mode
  document.forms[0].enableWorkMode.checked = options.workMode.enabled;
  document.forms[0].workModeStart.value = options.workMode.startTime;
  document.forms[0].workModeEnd.value = options.workMode.endTime;
});

// Save on change
document.forms[0].addEventListener('change', async () => {
  const status = document.getElementById('status');
  status.textContent = `⏳ ${browser.i18n.getMessage('options_saving')}`

  await saveOptions({
    syncSettings: document.forms[0].syncSettings.checked,
    thumbnailMode: document.forms[0].thumbnailMode.value,
    disabledOnPages: {
      results: document.forms[0].disableSearchResultPage.checked,
      playlist: document.forms[0].disablePlaylistPage.checked,
      watch: document.forms[0].disableWatchPage.checked,
      subscriptions: document.forms[0].disableSubscriptionsPage.checked,
      everywhere: document.forms[0].disableEverywhere.checked,
    },
    workMode: {
      enabled: document.forms[0].enableWorkMode.checked,
      startTime: document.forms[0].workModeStart.value,
      endTime: document.forms[0].workModeEnd.value,
    },
  })

  // Artificial delay, so the 'saving' message actually appears
  await new Promise(resolve => setTimeout(resolve, 200))

  status.textContent = `✅ ${browser.i18n.getMessage('options_saved')}`;
});

/**
 * @param {Options} options
 * @returns {Promise<void>}
 */
const saveOptions = async (options) => new Promise((resolve) => {
  browser.storage.local.set(options, resolve);
  if (options.syncSettings) {
    browser.storage.sync.set(options, resolve);
  }
})