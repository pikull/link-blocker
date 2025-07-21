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

let blockList = [];

chrome.storage.sync.get("blockedSites", (data) => {
    blockList = data.blockedSites || defaultBlockList;
    blockList.forEach(displaySite);
    chrome.storage.sync.set({ blockedSites: blockList });
    updateRules(blockList);
});

const addButton = document.getElementById("add");
addButton.addEventListener("click", () => {
    const input = document.getElementById("site");
    const site = input.value.trim();

    if (!site || blockList.includes(site)) return;

    blockList.push(site);
    chrome.storage.sync.set({ blockedSites: blockList });
    updateRules(blockList);
    displaySite(site);
});

const displaySite = (site) => {
    const div = document.createElement("div");
    div.className = "wrapper";

    const text = document.createElement("p");
    text.textContent = site;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "x";

    removeBtn.addEventListener("click", () => {
        blockList = blockList.filter((s) => s !== site);
        chrome.storage.sync.set({ blockedSites: blockList });
        updateRules(blockList);
        div.remove();
    });

    div.appendChild(text);
    div.appendChild(removeBtn);

    const siteList = document.getElementById("site-list");
    siteList.insertBefore(div, siteList.firstChild);
};

const updateRules = (sites) => {
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

        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: currentIds,
            addRules: newRules,
        });
    });
};
