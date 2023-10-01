/** @typedef {import("./common")} */

const css = {
  "normal": "/* Nothing to do */",
  "hidden": `
ytd-thumbnail, ytd-playlist-thumbnail, .rich-thumbnail, .ytd-playlist-header-renderer.thumbnail-wrapper, #thumbnail, #video-preview, ytm-media-item .media-item-thumbnail-container, ytm-reel-item-renderer .video-thumbnail-container-vertical, ytm-playlist-video-renderer .compact-media-item-image, .ytp-videowall-still-image {
  display: none !important;
}
ytm-reel-shelf-renderer .reel-shelf-items>* {
  height: auto !important;
  align-items: flex-start !important;
}
ytm-reel-item-renderer .reel-item-metadata {
  position: static !important;
}
.ytp-videowall-still-info-content {
  opacity: 1 !important;
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
  max-height: 0px !important;
  min-height: 0px !important;
}

ytd-playlist-video-renderer:not(:hover) ytd-thumbnail,
.ytd-item-section-renderer:not(:hover) ytd-thumbnail {
  max-width: 0px !important;
  min-width: 0px !important;
}

.ytd-ghost-grid-renderer.rich-thumbnail,
.skeleton-bg-color.rich-thumbnail,
.ytd-playlist-header-renderer.thumbnail-wrapper,
.ytp-videowall-still:not(:hover) .ytp-videowall-still-image,
#video-preview {
  display: none !important;
}

.ytp-videowall-still-info-content {
  opacity: 1 !important;
}`,
  "blurred": `ytd-thumbnail img, ytd-playlist-thumbnail img, .video-thumbnail-img, .ytp-videowall-still-image {
  filter: blur(16px);
}`,
  "solid-color": `
.yt-core-image {
  display: none !important;
  background-color: var(--yt-spec-additive-background);
}

ytd-thumbnail.style-scope.ytd-compact-video-renderer {
  background-color: var(--yt-spec-additive-background);
  border-radius: 1rem;
}

ytd-thumbnail #thumbnail.ytd-thumbnail {
  background-color: var(--yt-spec-additive-background);
}

.ytp-videowall-still-image {
  background-color: var(--yt-spec-static-overlay-filled-hover);
  background-image: none !important;
}
.ytp-videowall-still-info-content {
  opacity: 1 !important;
}`,
};

const elem = document.createElement("style");
document.documentElement.appendChild(elem);

const updateElem = async () => {
  const options = await loadOptions()

  const isDisabled = options.disabledOnPages.everywhere
    || (options.disabledOnPages.results && window.location.pathname === '/results')
    || (options.disabledOnPages.playlist && window.location.pathname === '/playlist')
    || (options.disabledOnPages.watch && window.location.pathname === '/watch')
    || (options.disabledOnPages.subscriptions && window.location.pathname === '/feed/subscriptions');

  elem.innerHTML = `/* Injected by the Hide YouTube Thumbnails extension */
  ${css[isDisabled ? 'normal' : options.thumbnailMode]}`
}

// Update when settings are changed
browser.storage.onChanged.addListener(updateElem)

// Update when moving page
// Also see https://github.com/domdomegg/hideytthumbnails-extension/issues/17
// In future we should use the Navigation API when it's supported in Firefox
// https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API
let lastPathname = window.location.pathname;
setInterval(() => {
  if (lastPathname !== window.location.pathname) {
    lastPathname = window.location.pathname
    updateElem();
  }
}, 200);

// Initialize on load
updateElem()
