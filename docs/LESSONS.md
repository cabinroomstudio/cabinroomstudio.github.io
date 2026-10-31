# Project lessons

One line each: what goes wrong, then what to do instead.

- The built-in preview pane runs with `document.hidden === true`, which pins
  `requestAnimationFrame` to about one call every 600ms: reveals, counters and
  scrolled screenshots all look broken when they are fine. Verify with headless
  Chrome against a local server, never from a pane screenshot.
- The pane also caches CSS hard: serve previews with `Cache-Control: no-store`.
- `overflow-x: auto` clips vertically too, so the 3D hover lift on the screenshot
  row got sliced: put the padding inside the scrolling container.
- A height-based accordion never fires `transitionend` when the new height equals
  the old one, so the FAQ would not collapse: use `grid-template-rows: 0fr -> 1fr`
  and no height JS at all.
- Legal pages load `components.css` but not `sections.css`, so anything shared by
  every page (nav, drawer, footer) must live in `components.css` or those pages
  render unstyled with a giant nav logo.
- `--z-drawer` must stay below `--z-nav`, or the open drawer covers its own close
  button.
- `og-image.jpg` carries a 26px dot grid: when patching a region, copy the
  replacement background from the same rows shifted a multiple of 26px, or the
  dots land out of phase. Text there is Segoe UI Semibold at 17px, 1.7px tracking.
- The OG images were originally set in DM Sans and DM Serif Display, which are not
  installed on this machine: a full re-render needs those font files fetched again.
- The GitHub Pages build-status API returns 404 unauthenticated, so a poll on it
  reports nothing: confirm a deploy by fetching the live bytes and comparing them
  (md5 for images, a grep for page text) against the local file.
- Pages has gone into `degraded_performance` before and taken 20 minutes instead
  of 40 seconds: a 404 right after a push is not proof of a broken deploy.
- Marketing copy and policy text drift apart: OfficeTrack serves ads while the old
  WFO Tracker pages claimed no internet permission, and the hero claimed "No ads".
  Re-read the live policy pages before writing any privacy claim on a product page.
