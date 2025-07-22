/* credit
 * the creation of this file
 * was assisted by ChatGPT
 */

document.addEventListener("DOMContentLoaded", () => {
    let blockList = [];
    const addButton = document.getElementById("add");
    const toggle = document.getElementById("toggle-blocking");
    const slider = document.querySelector(".slider");

    chrome.storage.sync.get(["blockedSites", "blockingEnabled"], (data) => {
        blockList = data.blockedSites || [];
        blockList.forEach(displaySite);

        const isEnabled = data.blockingEnabled ?? true;
        toggle.checked = isEnabled;
        slider.offsetHeight;
        slider.classList.add("transition");

        if (isEnabled) updateRules(blockList);
        chrome.storage.sync.set({
            blockedSites: blockList,
            blockingEnabled: isEnabled,
        });
    });

    addButton.addEventListener("click", () => {
        const input = document.getElementById("site");
        const site = input.value.trim();
        const isEnabled = toggle.checked;

        if (!site || blockList.includes(site)) return;

        blockList.push(site);
        chrome.storage.sync.set({ blockedSites: blockList });
        if (isEnabled) {
            updateRules(blockList);
        }
        displaySite(site);
    });

    toggle.addEventListener("change", () => {
        const isEnabled = toggle.checked;
        chrome.storage.sync.set({ blockingEnabled: isEnabled });

        if (isEnabled) updateRules(blockList);
        else {
            chrome.declarativeNetRequest.getDynamicRules((rules) => {
                const currentIds = rules.map((rule) => rule.id);
                chrome.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: currentIds,
                    addRules: [],
                });
            });
        }
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
});
