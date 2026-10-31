# Session archive

Newest first. Finished or superseded items move here from `docs/SESSION.md`.

## 2026-10-31

- Removed the "What's next" roadmap: the section, 143 lines of CSS, the 115-line
  `initRoadmap`, the five node colour tokens, and the dead `.rm-item` /
  `.roadmap-svg` noscript rules that had been copy-pasted into all 8 legal pages.
  Nav "What's next" became "Studio"; the drawer gained an OfficeTrack link.
- Homepage now names both live apps: apps subhead rewritten, OfficeTrack added to
  the JSON-LD graph, meta/OG/Twitter descriptions mention both. `fa83dd3`.
- `og-image.jpg` badge "HOME OF WEIGHLY" became "WEIGHLY . OFFICETRACK", patched
  in place rather than re-rendered. `47f4b2b`.
- Added `scripts/gate.sh`.

## 2026-10-12

- OfficeTrack went to Play production: coming-soon badges became Play buttons,
  CTA rewritten, JSON-LD url points at the listing, index card shows "Live on
  Google Play", OfficeTrack dropped off the roadmap. `a6a7c3c`.
- Published the held-back commits: OfficeTrack product page `dad51ad`, and
  `app-ads.txt` for AdMob verification `2ab93dd`.

## 2026-10-04 and earlier

- Built `officetrack.html` on the `weighly.html` pattern: feature-graphic hero,
  4 feature tiles, 7 WebP screenshots with a lightbox, Pro section without
  prices, privacy card. Scoped brand accent via inline custom properties.
- Published the OfficeTrack policies and turned `wfo-tracker-privacy.html` and
  `wfo-tracker-terms.html` into canonical redirect stubs. `ba972ee`.
- Added the QuizApp policy pages.
- Full visual revamp: `index.html` went from 245KB to ~22KB, split into
  `assets/css/{tokens,base,components,sections,legal}.css` and `assets/js/main.js`.
  Dot-grid background with a pointer-tracked highlight and trailing aurora
  replaced the symbol warp.
