# Session notes

Last updated: 2026-11-08, `c90e4a4` (pushed, in sync with origin)

## Now

Nothing in progress. The site is live and current: homepage covers only the two
apps that are on Google Play, the notes and the gate are in the repo but excluded
from the published site, and the live pages were verified by fetching them.

## Uncommitted

- `docs/jekyll-lore.md` - background reading on the Jekyll name and the Stevenson
  novella, written on request. Not site content. Open question below.

Gate: **PASS** (`bash scripts/gate.sh`, exit 0). Checks local refs resolve,
JSON-LD parses, no em dashes, JS parses, CSS braces balance, sitemap URLs exist
on disk, and "WFO Tracker" survives only in the two redirect stubs.

## Next

1. **Play Console (user action).** Point the OfficeTrack listing's privacy and
   terms links at `officetrack-privacy.html` / `officetrack-terms.html`. The old
   `wfo-tracker-*.html` URLs still work, but only through a meta-refresh.
2. **Refresh the social preview cache.** `og-image.jpg` changed on 2026-10-31;
   LinkedIn Post Inspector and the Facebook Sharing Debugger force a re-scrape of
   `https://cabinroomstudio.github.io/`. Until then they show the old card.
3. **Decide on `docs/jekyll-lore.md`:** commit it, or move it out of this repo.
   It is excluded from the published site either way.
4. **The gaps to revisit.** With the roadmap gone, nothing on the site hints at
   future work. Options discussed and not taken: a notify-me capture, a changelog
   page, or one line in the about section. Decide, do not just re-add a timeline.
5. **QuizApp.** `quizapp-privacy.html` and `quizapp-terms.html` are published and
   in `sitemap.xml`, but QuizApp has no product page, no index card, and is not on
   Play. Decide whether those two URLs stay listed.
6. Optional polish, never built: command palette, View Transitions, scroll-spy
   rail, a "no analytics" note.

## Decisions

- Identity stays amber `#E0A94A` + deep navy. Dark only, no light toggle.
- `prefers-reduced-motion` reduces motion, it does not disable it: the pointer
  highlight snaps instead of easing.
- No em dashes anywhere in site copy. The gate enforces this.
- Contact is a native Web3Forms form, not a Google Form. No reply-time promise.
- Donations / Buy Me a Coffee: dropped, too early for the studio.
- No "No ads" claim in the hero: OfficeTrack serves ads.
- 2026-10-31: the site advertises shipped apps only. Both Weighly and OfficeTrack
  are in Play production and each has a card, a product page and a Play button.
- 2026-10-31: internal files stay in the repo but out of the published site, via
  `exclude: [docs, scripts]` in `_config.yml`. Add new internal folders there.
- Shared chrome (nav, drawer, footer) lives in `components.css`, not
  `sections.css`, so the legal pages can load one stylesheet fewer.
- `app-ads.txt` at the site root is required by AdMob; leave it exactly one line.
