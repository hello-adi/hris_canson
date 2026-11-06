# Hris Canson

![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat-square&logo=googlechrome&logoColor=white)
![Firefox](https://img.shields.io/badge/Firefox-Add--on-FF7139?style=flat-square&logo=firefoxbrowser&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-black?style=flat-square)
![MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![No Tracking](https://img.shields.io/badge/Privacy-No%20Tracking-brightgreen?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-yellow?style=flat-square)

### Take a seat and rethink your choices.

An intervention before every impulse purchase — and every doomscroll rabbit hole you put on the list.

Open a watched site. Chris appears. You explain yourself. Then you continue if you still want to.

> **Demo GIF** — record with OpenScreen using [`docs/DEMO.md`](docs/DEMO.md), then drop the file here (e.g. `docs/assets/demo.gif`).

<!--
![Demo](docs/assets/demo.gif)
-->

---

## How it works

1. **Add a website.**
2. **Visit it.**
3. **Chris intervenes.**
4. **Reconsider your life choices.**

That’s the whole product.

---

## Features

- **Watchlist you control** — only the sites you add
- **Categories that matter** — Shopping, Social, Entertainment, Other change the intervention tone
- **Random one-liners** — so it doesn’t feel like the same lecture every time
- **Confession gate** — write a short explanation before you proceed
- **Local-first** — no accounts, no analytics, no server
- **Chrome + Firefox** — one Manifest V3 codebase

---

## Install

### Chrome (unpacked)

1. Clone or download this repo.
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. **Load unpacked** → select this folder.
5. Pin **Hris Canson** and add a site.

*Chrome Web Store link — add when published.*

### Firefox (temporary / development)

1. Open `about:debugging#/runtime/this-firefox`.
2. **Load Temporary Add-on…**
3. Select `manifest.json` in this folder.

*Firefox Add-ons (AMO) link — add when published.*

> Temporary Firefox add-ons are removed when the browser restarts. For daily use, publish to AMO or use a non-temporary packaging flow.

---

## Privacy

| | |
|--|--|
| Analytics | None |
| Tracking | None |
| Accounts | None |
| Your data | Stays in the browser |

Site list is stored with the extension (`storage.sync`). Confessions are **not** saved. Details: [PRIVACY.md](PRIVACY.md).

---

## Tech stack

- **Manifest V3** WebExtension
- **Vanilla JS** — no build step, no framework
- `storage.sync` for the watchlist
- Content script overlay + service worker re-injection for SPA navigations
- Shared helpers in `shared.js` for host matching (Chrome + Firefox via `browser` / `chrome`)

---

## Why I built this

Impulse buying (and impulse tabbing) happens in seconds. Full site blockers are easy to disable and feel like punishment. I wanted something **humorous** that interrupts the decision just long enough to make you own it — without becoming a settings-heavy productivity suite.

One joke. One purpose. One interaction.

---

## Project layout

```
hris_canson/
├── manifest.json      # MV3 + Firefox gecko id
├── shared.js          # normalize/match + browserAPI
├── popup.html / .js   # watchlist UI
├── content.js         # intervention overlay
├── background.js      # SPA re-injection
├── images/            # runtime icons & art
├── docs/              # demo script, marketing assets
└── store/             # store listing copy
```

---

## Roadmap

- [ ] Publish on Chrome Web Store
- [ ] Publish on Firefox Add-ons
- [ ] Demo GIF in this README
- [ ] Optional: self-host fonts (fully offline UI)

Not planned: accounts, cloud sync of our own, AI, themes, or feature sprawl.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep PRs small and on-theme.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE)

---

*Save your wallet from yourself.*
