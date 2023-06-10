/** @typedef {import("./common")} */

const css = {
  "normal": "/* Nothing to do */",
  "hidden": `
ytd-thumbnail, ytd-playlist-thumbnail, .rich-thumbnail, .ytd-playlist-header-renderer.thumbnail-wrapper, ytm-media-item .media-item-thumbnail-container, ytm-reel-item-renderer .video-thumbnail-container-vertical, ytm-playlist-video-renderer .compact-media-item-image {
  display: none !important;
}
ytm-reel-shelf-renderer .reel-shelf-items>* {
  height: auto !important;
  align-items: flex-start !important;
}
ytm-reel-item-renderer .reel-item-metadata {
  position: static !important;
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
  "blurred": `ytd-thumbnail img, ytd-playlist-thumbnail img, .video-thumbnail-img {
  filter: blur(16px);
}`,
}

const elem = document.createElement("style");
document.documentElement.appendChild(elem);

const IsItWorkTime = (startTime, endTime)=>{
  currentDate = new Date();

  startDate = new Date(currentDate.getTime());
  startDate.setHours(startTime.split(":")[0]);
  startDate.setMinutes(startTime.split(":")[1]);
  startDate.setSeconds(0);

  endDate = new Date(currentDate.getTime());
  endDate.setHours(endTime.split(":")[0]);
  endDate.setMinutes(endTime.split(":")[1]);
  endDate.setSeconds(0);

  return currentDate > startDate && currentDate < endDate;
}

const updateElem = async () => {
  const options = await loadOptions()

  const isDisabled = options.disabledOnPages.everywhere
    || (options.disabledOnPages.results && window.location.pathname === '/results')
    || (options.disabledOnPages.playlist && window.location.pathname === '/playlist')
    || (options.disabledOnPages.watch && window.location.pathname === '/watch')
    || (options.disabledOnPages.subscriptions && window.location.pathname === '/feed/subscriptions');

  if(options.workMode.enabled){

    if(IsItWorkTime(options.workMode.startTime, options.workMode.endTime)){
      elem.innerHTML = `/* Injected by the Hide YouTube Thumbnails extension */
      ${css[options.thumbnailMode]}`
    }else{
      elem.innerHTML = `/* Injected by the Hide YouTube Thumbnails extension */
      ${css["normal"]}`
    }
  }else{
    elem.innerHTML = `/* Injected by the Hide YouTube Thumbnails extension */
    ${css[isDisabled ? 'normal' : options.thumbnailMode]}`
  }

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
