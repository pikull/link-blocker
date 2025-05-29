let site = window.location.hostname;
let urls = ["youtube.com", "instagram.com", "netflix.com", "facebook.com"];
for (let url of urls) {
    if (site.includes(url)) {
        console.log("attempting to access blocked site");
        window.location.href = chrome.runtime.getURL("blocked.html");
        alert("dude get off " + site + " and lock in");
        // OR
        // window.location.href = "about:blank";
        // OR
        // document.body.innerHTML = "";
        // document.body.style.backgroundColor = "black";
        console.log("blocked " + site);
        break;
    }
}
