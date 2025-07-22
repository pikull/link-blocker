# Link Blocker

#### Video demo: TODO

This is my CS50x 2025 final project. When doing homework or studying, it is easy to get distracted online. This link blocker is a Chrome browser extension that helps you stay focused by blocking access to distracting or unwanted websites -- and it comes with an editable pre-defined default block list!

## Features

-   Efficient blocking using `chrome.declarativeNetRequest`
-   Editable block list in extension popup window
-   Enable or disable blocking whenever with a toggle

## Installation

1. **Download or clone the repo**  
   Ensure `git` is installed on your machine. Then run
    ```sh
    git clone https://github.com/pikull/link-blocker.git
    ```
    If you do not want to use git you may also click the green code button and choose `Download ZIP`. Then unzip the file.
2. **Go to [chrome://extensions/](chrome://extensions/)**
3. Ensure the **`Developer mode`** toggle is enabled in the top right corner.
4. Click **`Load unpacked`** in the top left and select the project folder.
5. The **Link Blocker** extension should now show up in your Chrome toolbar!

## Specification

### How does it work?

1. **`manifest.json`**

    This is a file required for a Chrome browser extension to run. It contains info about the extension, including its name, description, and permissions it may have.

    Since June 2024, Manifest v2 has been deprecated by Google, so listing `"manifest_version": 3` is a must. The default file locations for `"icons"`, the `"default_popup"`, and the background `"service_worker"` have also been listed here. And lastly the permissions `"storage"` and `"declarativeNetRequest"` were also listed.

    The `"storage"` permission allows for persistent storage of whether or not the blocking is enabled as well as the list of sites that should be blocked. More info can be found in the [Chrome API documentation](https://developer.chrome.com/docs/extensions/reference/api/storage).

    The `"declarativeNetRequest"` permission allows this extension to view network requests and stop or change them before they are sent, by specifying declarative rules. More info can be found in the [Chrome API documentation](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest).

    <hr>

2. **`service_worker.js`**

    Chrome allows extension service workers to run in the background. They essentially work as a central event handler. In this case, the service worker updates the `declarativeNetRequest` dynamic rules upon the extension's installation. This is so that the default blocking list will be active the moment Link Blocker gets installed instead of after the popup is opened and the `popup.js` script runs.

    The service worker achieves this with a `chrome.runtime.onInstalled` listener that will then call the `updateRules` function, which, for each item defined in the `defaultBlockList`, will create a new set of rules under the `requestDomains` condition and replace the existing set of rules with it. Then, in `chrome.storage.sync`, it will set the current list of `blockedSites` to the `defaultBlockList` and the `blockingEnabled` to the default value of `true`.

    <hr>

3. **`popup.html`**

    This is a simple `html` file that gets displayed as a popup when the extension is clicked in the toolbar. It contains a "toggle" `div` with a slider to enable or disable the blocking. It also has a text input field for a site name as well as an add button. Then it contains a "site-list" `div` that will get populated with the list of sites to be blocked.

    <hr>

4. **`popup.css`**

    This `css` file contains styling options for the `popup.html` file as well as animation options for the slider. One interesting thing in this file is the `.transition` class that contains these animation options. The purpose of having a separate class is so that when `popup.html` gets displayed, it doesn't have any transitions until after the proper value is set from `chrome.storage.sync` by the `popup.js` script.

    <hr>

5. **`popup.js`**

    Finally this is the script that does most of the work. Since it is listed in the `<head>` tag of `popup.html`, the entire script is wrapped in a `"DOMContentLoaded"` eventListener. Here's how it works:

    The first thing it does is to get the data from the `chrome.storage.sync`, and initialize local variables `blockList` and `isEnabled` with these values.

    Then, based on the value of `blockingEnabled`, it sets the position of the toggle in `popup.html` and enables animations after forcing a reflow with the `offsetHeight` method. This is to ensure that the toggle is fully rendered before the animations are enabled.

    After that, it adds two eventListeners - one for when the add button gets clicked and the other for when the toggle's position is changed. When the add button is clicked, it will add the site in the text input field to the `blockList` and update `chrome.storage.sync`. Then it will call an `updateRules` function (which is nearly identical to the one in `service_worker.js`) as well as another function called `displaySite`.

    The `displaySite` function will use the builtin `createElement` function to create a `div` with the site name and a remove button. When the remove button is clicked, it will remove the site from the `blockList` and update the `chrome.storage.sync` using its own eventListener. This `div` will get inserted into the top of `popup.html`'s "site-list" `div`.

## License

This project is licensed under the MIT license - see the [LICENSE](LICENSE) file for details.
