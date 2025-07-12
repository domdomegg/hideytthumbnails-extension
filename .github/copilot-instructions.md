# Hide YouTube Thumbnails Extension: Developer Documentation

## Overview

This browser extension is designed to hide or modify the appearance of video thumbnails and related elements on YouTube. It provides users with several modes for thumbnail display (hidden, blurred, solid color, etc.) and allows fine-grained control over where the extension is active. The extension is implemented using standard WebExtension APIs and is compatible with both Firefox and Chromium-based browsers.

---

## File Structure and Key Components

- **manifest.json**: Declares the extension's metadata, permissions, content scripts, options UI, and localization.
- **inject.js**: The main content script that injects CSS into YouTube pages to hide or modify thumbnails based on user settings.
- **options.html**: The options page UI, allowing users to configure how and where the extension operates.
- **options.js**: Handles logic for loading, saving, and syncing user preferences in the options page.
- **common.js**: (Not shown here) Expected to provide shared functions like `loadOptions()` used by both `inject.js` and `options.js`.
- **_locales/**: Contains translation files for internationalization.

---

## How the Options Page Works (`options.html` & `options.js`)

### `options.html`
- Provides a form UI for users to:
  - Choose how thumbnails are displayed (hidden, blurred, etc.).
  - Select which YouTube pages the extension is disabled on.
  - Enable/disable syncing settings across browsers.
- Uses `data-i18n` attributes for localization.
- Loads `common.js` and `options.js` for logic and shared functions.

### `options.js`
- On page load (`DOMContentLoaded`):
  - Localizes all elements with `data-i18n` using `browser.i18n.getMessage`.
  - Loads saved options via `loadOptions()` and updates the form fields accordingly.
- On form change:
  - Saves the new options to `browser.storage.local` (and `browser.storage.sync` if syncing is enabled).
  - Shows a temporary "saving" status, then updates to "saved".
- **Example: Saving Options**
  ```js
  await saveOptions({
    syncSettings: document.forms[0].syncSettings.checked,
    thumbnailMode: document.forms[0].thumbnailMode.value,
    disabledOnPages: {
      results: document.forms[0].disableSearchResultPage.checked,
      // ...other page options...
    },
  })
  ```

---

## How the Content Script Works (`inject.js`)

### Core Logic
- Defines several CSS templates for different thumbnail modes (hidden, blurred, etc.).
- Injects a `<style>` element into the page and updates its contents based on user settings.
- Listens for changes in storage (settings) and page navigation to update the CSS dynamically.
- Uses `loadOptions()` (from `common.js`) to fetch user preferences.
- Determines if the extension should be disabled on the current page by checking the URL path and user settings.
- Updates the injected CSS whenever:
  - The user changes settings in the options page.
  - The user navigates to a different YouTube page (using a polling interval to detect path changes).

### Example: Injecting CSS Based on Settings
```js
const updateElem = async () => {
  const options = await loadOptions();
  const isDisabled = options.disabledOnPages.everywhere
    || (options.disabledOnPages.results && window.location.pathname === '/results')
    // ...other page checks...
  elem.innerHTML = `/* Injected by the Hide YouTube Thumbnails extension */\n  ${css[isDisabled ? 'normal' : options.thumbnailMode]}`;
}
```

---

## How `options.html` and `options.js` Work Together

- The options page UI (`options.html`) provides form controls for all user-configurable settings.
- `options.js`:
  - Loads the current settings and updates the form fields on page load.
  - Listens for changes to the form and saves the new settings.
  - Provides user feedback ("saving", "saved") in the UI.
- All settings are stored in `browser.storage.local` (and optionally `browser.storage.sync`), making them accessible to the content script (`inject.js`).

---

## How to Extend the Extension

### 1. Add a New Thumbnail Mode
- Define a new CSS template in `inject.js`:
  ```js
  const cssNewMode = `
    /* Your new CSS rules here */
  `;
  css['new-mode'] = cssNewMode;
  ```
- Add a new radio button to `options.html`:
  ```html
  <input type="radio" name="thumbnailMode" id="new-mode" value="new-mode">
  <label for="new-mode">New Mode</label><br />
  ```
- Update localization files in `_locales/` for the new label.

### 2. Hide/Modify Additional Elements
- Add new CSS selectors to the relevant CSS template in `inject.js`.
- Example:
  ```js
  const cssHidden = `
    // ...existing selectors...
    .new-youtube-element {
      display: none !important;
    }
  `;
  ```

### 3. Add More Per-Page Controls
- Add new checkboxes to `options.html` for additional YouTube page types.
- Update the `disabledOnPages` object in both `options.js` and `inject.js` to handle the new page type.
- Example:
  ```js
  // options.js
  document.forms[0].disableNewPage.checked = options.disabledOnPages.newPage;
  // inject.js
  || (options.disabledOnPages.newPage && window.location.pathname === '/newpage')
  ```

### 4. Add More Settings
- Add new form fields to `options.html`.
- Update `options.js` to load and save the new setting.
- Update `inject.js` to use the new setting as needed.

---

## Code Example: Adding a New Setting
Suppose you want to add an option to hide video titles:

1. **Add a checkbox to `options.html`:**
   ```html
   <input type="checkbox" name="hideTitles" id="hideTitles">
   <label for="hideTitles">Hide video titles</label><br />
   ```
2. **Update `options.js` to load/save the new setting:**
   ```js
   document.forms[0].hideTitles.checked = options.hideTitles;
   // ...
   await saveOptions({
     // ...existing options...
     hideTitles: document.forms[0].hideTitles.checked,
   });
   ```
3. **Update `inject.js` to apply the new setting:**
   ```js
   if (options.hideTitles) {
     elem.innerHTML += '\nytd-video-renderer #video-title { display: none !important; }';
   }
   ```

---

## Best Practices
- Use the `browser` namespace for cross-browser compatibility.
- Always update localization files when adding new UI elements.
- Test changes on different YouTube page types to ensure selectors are correct.
- Keep CSS selectors as specific as possible to avoid unintended side effects.

---

## References
- [WebExtensions API documentation (MDN)](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [YouTube DOM structure (for selectors)](https://www.youtube.com/)
- [Project GitHub Repository](https://github.com/domdomegg/hideytthumbnails-extension)


