# Contributing to Hris Canson

Thanks for wanting to help. This project stays intentionally small: one joke, one purpose, one interaction.

## Development setup

### Chrome

1. Clone the repo.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. **Load unpacked** → select this folder.
5. Click the refresh icon on the extension card after each change.

### Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. **Load Temporary Add-on…**
3. Select `manifest.json` in this folder.
4. Reload the temporary add-on after changes (temporary add-ons reset when Firefox restarts).

## Project layout

| File | Role |
|------|------|
| `manifest.json` | MV3 manifest (Chrome + Firefox gecko id) |
| `shared.js` | Host normalize/match helpers + `browserAPI` |
| `popup.html` / `popup.js` | Watchlist UI |
| `content.js` | Intervention overlay |
| `background.js` | SPA re-injection |
| `images/` | Runtime icons and art only |
| `docs/` | Marketing assets, demo notes |
| `store/` | Store listing copy drafts |

There is no build step. Edit files and reload the extension.

## Guidelines

- Prefer small, focused PRs.
- Keep the product single-purpose — avoid accounts, analytics, cloud sync, or large settings surfaces.
- Match existing tone: dry, a little dramatic, never preachy.
- Test add → visit → intervene → confess → continue on both Chrome and Firefox when possible.
- Do not commit large unused binaries into `images/` (use `docs/assets/` for marketing only).

## Reporting bugs

Open a GitHub issue with:

- Browser + version
- Steps to reproduce
- Expected vs actual behavior

## License

By contributing, you agree that your contributions are licensed under the MIT License.
