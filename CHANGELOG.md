# Changelog

All notable changes to Hris Canson are documented here.

## [1.3.0] — 2026

### Added

- Category-aware intervention messages (Shopping, Social, Entertainment, Other)
- Expanded message pools with Chris-style one-liners
- URL normalization when adding sites (handles full URLs, `www`, paths)
- Duplicate-site detection with inline feedback
- Keyboard-friendly popup: focus rings, Escape closes help, Enter adds sites
- Overlay treated as a modal dialog with focus trap and focus styles
- Firefox support via Manifest V3 `browser_specific_settings` and shared `browser`/`chrome` API alias
- Multi-size icons (16 / 32 / 48 / 128)
- Project docs: README, LICENSE (MIT), privacy policy, contributing guide, demo script, store copy drafts

### Changed

- Empty state and help copy match product tone (“No suspects on the watchlist”)
- Stronger intervention framing (“Intervention” eyebrow + category tag)
- Safer host matching (exact host or subdomain, not loose substring)
- Storage field `genre` migrated to `category`
- Popup list rows built with safe DOM APIs
- Light enter animations on popup rows and overlay panel

### Removed

- Unused legacy `content.html` overlay page
- Dead font imports and non-runtime marketing binaries from the extension image folder (moved under `docs/assets/`)

## [1.2] — prior

- Popup site list with categories
- Content-script intervention overlay with confession gate
- Background re-injection for SPA navigations
