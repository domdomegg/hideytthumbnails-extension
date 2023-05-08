/** @typedef {import("./common")} */

const css = {
  "normal": "/* Nothing to do */",
  "hidden": `
ytd-thumbnail, ytd-playlist-thumbnail, .rich-thumbnail, .ytd-playlist-header-renderer.thumbnail-wrapper {
  display: none !important;
}`,
  "hidden-except-hover": `
ytd-thumbnail {
  transition: 0.25s ease-in all;
  overflow: hidden;
  max-height: 400px;
  max-width: 360px;
}

ytd-rich-item-renderer:not(:hover) ytd-thumbnail,
ytd-grid-video-renderer:not(:hover) ytd-thumbnail,
ytd-playlist-video-renderer:not(:hover) ytd-thumbnail {
  max-height: 0px;
  min-height: 0px;
}

ytd-playlist-video-renderer:not(:hover) ytd-thumbnail,
.ytd-item-section-renderer:not(:hover) ytd-thumbnail {
  max-width: 0px;
  min-width: 0px;
}

.ytd-ghost-grid-renderer.rich-thumbnail,
.skeleton-bg-color.rich-thumbnail,
.ytd-playlist-header-renderer.thumbnail-wrapper {
  display: none !important;
}`,
  "blurred": `ytd-thumbnail img, ytd-playlist-thumbnail img {
  filter: blur(16px);
}`,
}

const elem = document.createElement("style");
document.documentElement.appendChild(elem);

const updateElem = async () => {
  const options = await loadOptions()

  const isDisabled = options.disabledOnPages.everywhere
    || (options.disabledOnPages.results && window.location.pathname === '/results')
    || (options.disabledOnPages.playlist && window.location.pathname === '/playlist')
    || (options.disabledOnPages.watch && window.location.pathname === '/watch');

  elem.innerHTML = `/* Injected by the Hide YouTube Thumbnails extension */
  ${css[isDisabled ? 'normal' : options.thumbnailMode]}`
}

browser.storage.onChanged.addListener(updateElem)
updateElem()
