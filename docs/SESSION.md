# Session notes

Last updated: 2026-10-31, `47f4b2b` (pushed, working tree otherwise clean)

## Now

Nothing in progress. The homepage was just refocused on the two apps that are
actually on Google Play; the "What's next" timeline of unreleased apps is gone.
Live site verified by fetching the deployed bytes.

## Uncommitted

- `scripts/gate.sh` - new, the project's single gate (see below)
- `docs/SESSION.md`, `docs/SESSION-archive.md`, `docs/LESSONS.md` - these notes

Gate: **PASS** (`bash scripts/gate.sh`, exit 0). Checks local refs resolve,
JSON-LD parses, no em dashes, JS parses, CSS braces balance, sitemap URLs
exist on disk, and "WFO Tracker" survives only in the two redirect stubs.
Negative-tested on a broken copy: it reports FAIL and exits 1.

## Next

1. **Play Console (user action).** Point the OfficeTrack listing's privacy and
   terms links at `officetrack-privacy.html` / `officetrack-terms.html`. The old
   `wfo-tracker-*.html` URLs still work, but only through a meta-refresh.
2. **Refresh the social preview cache.** `og-image.jpg` changed on 2026-10-31;
   LinkedIn Post Inspector and the Facebook Sharing Debugger force a re-scrape of
   `https://cabinroomstudio.github.io/`. Until then they show the old card.
3. **The gaps to revisit.** With the roadmap gone, nothing on the site hints at
   future work. Options discussed and not taken: a notify-me capture, a changelog
   page, or one line in the about section. Decide, do not just re-add a timeline.
4. **QuizApp.** `quizapp-privacy.html` and `quizapp-terms.html` are published and
   in `sitemap.xml`, but QuizApp has no product page, no index card, and is not on
   Play. Decide whether those two URLs stay listed.
5. **Commit the gate** once it has survived a couple of real runs.
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
- Shared chrome (nav, drawer, footer) lives in `components.css`, not
  `sections.css`, so the legal pages can load one stylesheet fewer.
- `app-ads.txt` at the site root is required by AdMob; leave it exactly one line.
