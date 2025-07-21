/* credit
 * the creation of this file
 * was assisted by ChatGPT
 */

chrome.runtime.onInstalled.addListener(() => {
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
    chrome.storage.sync.set({ blockedSites: defaultBlockList });
    updateRules(defaultBlockList);
    chrome.storage.sync.set({ blockingEnabled: true });
});
