// const blacklist = [
//     "*://*.instagram.com/*",
//     "*://*.youtube.com/*"
// ];

// chrome.webRequest.onBeforeRequest.addListener(
//     function(details) {
//         for (let pattern of blacklist) {
//             let regex = new RegExp(pattern.replace(/\*/g, ".*"));
//             if (regex.test(details.url)) {
//                 console.log("URL blocked: ", details.url);
//                 return { cancel: true };
//             }
//         }
//         return { cancel: false };
//     },
//     { urls: ["<all_urls>"] },
//     ["blocking"]
// );
// */