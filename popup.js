let blockList = [];
const defaultBlockList = [
    "facebook.com",
    "instagram.com",
    "twitter.com",
    "reddit.com",
    "youtube.com",
    "netflix.com",
    "tiktok.com",
    "discord.com",
    "snapchat.com",
    "pinterest.com",
    "tumblr.com",
    "linkedin.com",
    "amazon.com",
    "hulu.com",
    "twitch.tv",
];

chrome.storage.sync.get("blockedSites", function(data) {
    blockList = data.blockedSites || defaultBlockList;
    blockList.forEach(displaySite);
    chrome.storage.sync.set({ blockedSites: blockList });
    updateRules(blockList);
});

document.getElementById("add").addEventListener("click", function() {
    const site = document.getElementById("site").value.trim();
    if (!site || blockList.includes(site)) return;

    blockList.push(site);
    chrome.storage.sync.set({ blockedSites: blockList });
    updateRules(blockList);
    displaySite(site);
});

function displaySite(site) {
    const div = document.createElement("div");
    div.className = "wrapper";
    const text = document.createElement("p");
    text.textContent = site;
    const but = document.createElement("button");
    but.textContent = "x";
    but.addEventListener("click", function() {
        blockList = blockList.filter((s) => s != site);
        chrome.storage.sync.set({ blockedSites: blockList });
        updateRules(blockList);
        div.remove();
    });
    div.appendChild(text);
    div.appendChild(but);
    let listElement = document.getElementById("site-list");
    listElement.insertBefore(div, listElement.firstChild);
}

function updateRules(sites) {
    chrome.declarativeNetRequest.getDynamicRules((currentRules) => {
        const currentIds = currentRules.map((rule) => rule.id);
        const newRules = sites.map((site, i) => ({
            id: i + 1,
            priority: 1,
            action: { type: "block" },
            condition: {
                requestDomains: [site],
                resourceTypes: [
                    "csp_report",
                    "font",
                    "image",
                    "main_frame",
                    "media",
                    "object",
                    "other",
                    "ping",
                    "script",
                    "stylesheet",
                    "sub_frame",
                    "webbundle",
                    "websocket",
                    "webtransport",
                    "xmlhttprequest",
                ],
            },
        }));

        chrome.declarativeNetRequest.updateDynamicRules(
            {
                removeRuleIds: currentIds,
                addRules: newRules,
            },
            () => {
                chrome.declarativeNetRequest.getDynamicRules((rules) => {
                    console.log("Current dynamic rules:", rules);
                });
            },
        );
    });
}
