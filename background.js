/* global browserAPI, normalizeWebsiteList, findMatchingSite */
importScripts("shared.js");

// Re-check on every completed navigation so the overlay
// fires even on soft navigations (SPAs) that don't reload the page.
browserAPI.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;

  browserAPI.storage.sync.get("websites", (data) => {
    const websites = normalizeWebsiteList(data.websites);
    if (websites.length === 0) return;

    try {
      const url = new URL(tab.url);
      const match = findMatchingSite(url.hostname, websites);

      if (match) {
        browserAPI.scripting.executeScript({
          target: { tabId },
          files: ["shared.js", "content.js"],
        });
      }
    } catch {
      // non-http urls (chrome://, about:, etc.) — ignore
    }
  });
});
