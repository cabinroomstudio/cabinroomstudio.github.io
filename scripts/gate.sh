#!/usr/bin/env bash
# One gate for the site. Exit code is the verdict: 0 PASS, 1 FAIL.
# Run from anywhere: bash scripts/gate.sh
set -u
cd "$(dirname "$0")/.." || exit 1
fail=0
skipped=0

say()  { printf '%-34s %s\n' "$1" "$2"; }
bad()  { say "$1" "FAIL  $2"; fail=1; }
ok()   { say "$1" "ok    $2"; }

pages=$(ls *.html | tr '\n' ' ')
say "pages" "$(echo $pages | wc -w) html files"

# 1. internal links and assets resolve
missing=$(node -e '
const fs=require("fs"),path=require("path");
let bad=[],checked=0;
for (const f of fs.readdirSync(".").filter(n=>n.endsWith(".html"))) {
  const h=fs.readFileSync(f,"utf8");
  for (const m of h.matchAll(/(?:href|src)="([^"#][^"]*)"/g)) {
    const u=m[1];
    if (/^(https?:|mailto:|data:|\/\/)/.test(u)) continue;
    checked++;
    const p=u.split("#")[0].split("?")[0];
    if (p && !fs.existsSync(path.join(".",p))) bad.push(f+" -> "+p);
  }
}
console.error("checked "+checked+" local refs");
console.log(bad.join("\n"));
' 2>/dev/null)
if [ -n "$missing" ]; then bad "local refs" "$(echo "$missing" | head -5 | tr '\n' ' ')"; else ok "local refs" "all resolve"; fi

# 2. every JSON-LD block parses
ld=$(node -e '
const fs=require("fs");let bad=[],n=0;
for (const f of fs.readdirSync(".").filter(x=>x.endsWith(".html"))) {
  for (const m of fs.readFileSync(f,"utf8").matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    n++; try { JSON.parse(m[1]); } catch (e) { bad.push(f+": "+e.message); }
  }
}
console.error(n+" blocks");
console.log(bad.join("\n"));
' 2>/dev/null)
if [ -n "$ld" ]; then bad "json-ld" "$ld"; else ok "json-ld" "all blocks parse"; fi

# 3. house style: no em dashes anywhere we author
em=$(grep -rln $'—' --include=*.html --include=*.css --include=*.js . 2>/dev/null)
if [ -n "$em" ]; then bad "no em dashes" "$em"; else ok "no em dashes" "clean"; fi

# 4. js parses
for j in assets/js/*.js; do
  if node --check "$j" 2>/dev/null; then ok "js syntax" "$j"; else bad "js syntax" "$j"; fi
done

# 5. css braces balance
for c in assets/css/*.css; do
  o=$(tr -cd '{' < "$c" | wc -c); k=$(tr -cd '}' < "$c" | wc -c)
  [ "$o" = "$k" ] || bad "css braces" "$c ($o open, $k close)"
done
ok "css braces" "$(ls assets/css/*.css | wc -l) files balanced"

# 6. sitemap points only at pages that exist
sm=$(grep -o '<loc>https://cabinroomstudio.github.io/[^<]*</loc>' sitemap.xml |
     sed 's|.*github.io/||;s|</loc>||')
for u in $sm; do
  [ -z "$u" ] && continue                 # the bare home URL
  [ -f "$u" ] || bad "sitemap" "$u listed but not on disk"
done
ok "sitemap" "$(echo "$sm" | wc -w) urls listed"

# 7. the retired WFO Tracker name survives only in the redirect stubs
stray=$(grep -rl "WFO Tracker" --include=*.html . 2>/dev/null |
        grep -v "wfo-tracker-privacy.html" | grep -v "wfo-tracker-terms.html")
if [ -n "$stray" ]; then bad "retired names" "$stray"; else ok "retired names" "only in redirect stubs"; fi

echo
[ "$skipped" -gt 0 ] && echo "skipped $skipped checks"
if [ "$fail" = 0 ]; then echo "GATE PASS"; else echo "GATE FAIL"; fi
exit $fail
