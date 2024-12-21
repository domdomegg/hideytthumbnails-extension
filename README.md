# hideytthumbnails-extension

A simple browser extension which removes thumbnails from YouTube, for less clickbaity browsing.

## ✨ Automatic install

Install this extension at:
- [Chrome Web Store](https://chrome.google.com/webstore/detail/hide-youtube-thumbnails/phmcfcbljjdlomoipaffekhgfnpndbef)
- [Firefox Add-ons](https://addons.mozilla.org/en-GB/firefox/addon/hide-youtube-thumbnails/)
- [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/hide-youtube-thumbnails/ocgbpppgeepjkmpeahegapfmiefdjcdk)

## 👷 Manual install

1. Clone this repository
2. Go to `chrome://extensions`
3. Enable `Developer mode` in the top right
4. Click `Load unpacked`, and select the cloned folder

## 🚀 Releasing new versions

Common: 

1. Bump version in `manifest.json`
2. Run `./package.sh` to generate `package.zip` (or check the GitHub actions build artifacts)

### Google

1. Go to [the extension in the Chrome Web Store developer dashboard](https://chrome.google.com/webstore/devconsole/6c72c8b9-8c99-4353-8a18-109703f24c82/phmcfcbljjdlomoipaffekhgfnpndbef/edit/package)
2. Click 'Upload new package', and select `package.zip`

### Mozilla Firefox

1. Go to [the extension in the Firefox Add-on Developer Hub](https://addons.mozilla.org/en-GB/developers/addon/hide-youtube-thumbnails/versions/submit/)
2. Click 'Submit a New Version', and select `package.zip`

### Microsoft Edge

1. Go to [the extension in the Microsoft Partner Center for Edge](https://partner.microsoft.com/en-us/dashboard/microsoftedge/d245c788-c342-4166-bd7e-a5f3d9c32ff1/packages/dashboard)
2. Click 'Update', 'Replace', and select `package.zip`
