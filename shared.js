/**
 * Shared helpers for popup, content script, and service worker.
 * Loaded via <script>, content_scripts[], or importScripts().
 * Safe to inject more than once (content_scripts + executeScript).
 */
(function (global) {
  if (global.__hcShared) return;
  global.__hcShared = true;

  global.browserAPI = global.browser ?? global.chrome;

  /**
   * Normalize user input into a bare hostname (no www, path, or protocol).
   * @param {string} input
   * @returns {string|null}
   */
  global.normalizeHost = function normalizeHost(input) {
    if (!input || typeof input !== "string") return null;

    let s = input.trim().toLowerCase();
    if (!s) return null;

    let host = "";
    try {
      if (/^[a-z][a-z0-9+.-]*:\/\//.test(s)) {
        host = new URL(s).hostname;
      } else if (s.includes("/") || s.includes("?") || s.includes("#")) {
        host = new URL("https://" + s).hostname;
      } else {
        host = s.split(":")[0];
      }
    } catch {
      host = s
        .replace(/^[a-z][a-z0-9+.-]*:\/\//, "")
        .split("/")[0]
        .split("?")[0]
        .split("#")[0]
        .split(":")[0];
    }

    host = host.replace(/\.+$/, "").replace(/^www\./, "");
    if (!host) return null;

    const valid =
      host === "localhost" ||
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(
        host
      );

    return valid ? host : null;
  };

  /**
   * Match current page hostname against a watched site host.
   * @param {string} hostname
   * @param {string} siteHost
   */
  global.hostMatches = function hostMatches(hostname, siteHost) {
    if (!hostname || !siteHost) return false;
    const h = String(hostname).toLowerCase().replace(/^www\./, "");
    const s = String(siteHost).toLowerCase().replace(/^www\./, "");
    return h === s || h.endsWith("." + s);
  };

  /**
   * Migrate legacy { genre } entries to { category } and normalize URLs.
   * @param {unknown[]} list
   * @returns {{ url: string, category: string }[]}
   */
  global.normalizeWebsiteList = function normalizeWebsiteList(list) {
    if (!Array.isArray(list)) return [];
    const seen = new Set();
    const out = [];

    for (const entry of list) {
      if (!entry) continue;
      const rawUrl = typeof entry === "string" ? entry : entry.url;
      const url = normalizeHost(rawUrl || "");
      if (!url || seen.has(url)) continue;
      seen.add(url);

      let category = "Other";
      if (typeof entry === "object") {
        category = entry.category || entry.genre || "Other";
      }
      if (category === "Social Media") category = "Social";

      out.push({ url, category });
    }
    return out;
  };

  /**
   * Find a matching watched site for the given hostname.
   * @param {string} hostname
   * @param {{ url: string, category: string }[]} websites
   */
  global.findMatchingSite = function findMatchingSite(hostname, websites) {
    if (!websites || !websites.length) return null;
    return websites.find((site) => hostMatches(hostname, site.url)) || null;
  };
})(globalThis);
