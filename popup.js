let array = [];

chrome.storage.sync.get("blockedSites", function (data) {
    array = data.blockedSites || [];
    array.forEach(displaySite);
});

document.getElementById("add").addEventListener("click", function () {
    const site = document.getElementById("site").value.trim();
    if (!site || array.includes(site)) return;

    array.push(site);
    chrome.storage.sync.set({ blockedSites: array });
    updateRules(array);
    displaySite(site);
});

function displaySite(site) {
    const div = document.createElement("div");
    div.className = "wrapper";
    const text = document.createElement("p");
    text.textContent = site;
    const but = document.createElement("button");
    but.textContent = "x";
    but.addEventListener("click", function () {
        array = array.filter((s) => s != site);
        chrome.storage.sync.set({ blockedSites: array });
        updateRules(array);
        div.remove();
    });
    div.appendChild(text);
    div.appendChild(but);
    document.body.appendChild(div);
}

function updateRules(sites) {
    chrome.declarativeNetRequest.getDynamicRules((currentRules) => {
        const currentIds = currentRules.map((rule) => rule.id);
        const newRules = sites.map((site, i) => ({
            id: i + 1,
            priority: 1,
            action: { type: "block" },
            condition: {
                urlFilter: site,
                resourceTypes: ["main_frame"],
            },
        }));

        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: currentIds,
            addRules: newRules,
        });
    });
}
