/* ═══════════════════════════════════════════════════════════════════════════
   Regenerates the token-alias block inside styles.css from the think sheet.

   THE CONTRACT: the host's sheet is primary, styles.css is the backup.

   That is enforced without `@layer` and without declaring `:root`. Every token
   the component consumes is aliased once, on `.ib-btn` itself, as

       --ib-t-fg2: var(--fg2, #8b93b5);

   so the host's value wins whenever it exists — a CSS fallback applies only to
   an absent custom property — and the vendored copy renders the component when
   it does not. Nothing is written to the host document, which is the part a
   layered `:root` block could not offer: layered or not, `:root { --border: … }`
   still hands every other component on the page a --border.

   Vendored defaults are resolved transitively, so a default never depends on a
   token the host might not have:

       --gradient-primary: linear-gradient(135deg, var(--primary-solid), var(--primary-solid-hover))
     → var(--gradient-primary, linear-gradient(135deg,
           var(--primary-solid, #0099ff), var(--primary-solid-hover, #018eed)))

   The seed set is scraped from styles.css itself — every `--ib-t-x` a rule
   mentions. Use a new token and the next run vendors it; stop using one and it
   disappears. No hand-maintained list, no drift.

     node scripts/sync-tokens.mjs                 rewrite the block
     node scripts/sync-tokens.mjs --check         exit 1 if stale (local gate)
     node scripts/sync-tokens.mjs --source=<path> read another sheet instead
                                                  (a URL works too)

   WHERE THE DEFAULT SOURCE POINTS, AND WHY IT MOVED. It used to be the CDN URL

       https://cdn.thinktalentws48.click/starterkit/colors_and_type.css

   which starterkit-theme still emits as the DEFAULT preset's legacy alias (see
   `cdnPaths` in that package's src/emit/cdn.ts). That copy is hand-uploaded,
   and republishing it is not this package's call to make — reading it as the
   default source means this package's CI cannot go green until someone with
   the CDN credentials republishes, which is a publish-ordering deadlock this
   repo cannot break on its own.

   So the default is now @devopsnext/starterkit-theme's INSTALLED copy —
   node_modules/@devopsnext/starterkit-theme/presets/think.css — not a sibling
   checkout. A sibling path (the way scripts/gen-brands.mjs still reads one) is
   wrong here specifically because THIS package has `.github/workflows/ci.yml`,
   and `pnpm sync:tokens:check` runs there straight after `pnpm install
   --frozen-lockfile` — a GitHub Actions runner checks out this one repo, so
   `../starterkit-theme` never exists on it. node_modules does, because the
   package is now a devDependency (see package.json) and `--frozen-lockfile`
   installs it. Reading node_modules over a sibling checkout wins on every
   count that matters here: it runs in CI, it runs from a bare clone with no
   sibling repo present, it reads the EXACT version this package pins rather
   than whatever a sibling working tree happens to have checked out, and it
   still needs no network — the CDN publish-ordering deadlock stays gone.
   Point `--source=` at the URL the day the CDN is current, or at a sibling
   checkout for local iteration against an unpublished theme change.

   The vendored defaults are deliberately Think's values — Think is the default
   preset, and styles.css matching it is what makes "no brand sheet loaded" and
   "Think selected" render identically.
   ═══════════════════════════════════════════════════════════════════════════ */

import { createRequire } from "node:module";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, sep } from "node:path";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const TARGET = join(ROOT, "styles.css");

/* The DEFAULT preset of @devopsnext/starterkit-theme, resolved through the
   package's own export map (`./presets/*.css`) so a restructure of its
   internals cannot silently point this at nothing. Falls back to the plain
   node_modules path when the package is not resolvable at all — not to
   change where we read from, only so the existsSync guard below can give a
   friendlier error than Node's raw MODULE_NOT_FOUND. */
const PACKAGE_SUBPATH = "@devopsnext/starterkit-theme/presets/think.css";
const DEFAULT_SOURCE = (() => {
  try {
    return createRequire(import.meta.url).resolve(PACKAGE_SUBPATH);
  } catch {
    return join(ROOT, "node_modules", "@devopsnext", "starterkit-theme", "presets", "think.css");
  }
})();

const sourceArg = process.argv.find((arg) => arg.startsWith("--source="));
const usingDefaultSource = !sourceArg;
const SOURCE = sourceArg ? sourceArg.slice("--source=".length) : DEFAULT_SOURCE;
const isRemote = /^https?:\/\//.test(SOURCE);

/* A machine-specific absolute path must never reach the shipped file, so the
   generated header names the source the way the repo sees it. For the default
   source that is doubly true: `require.resolve()` above answers through
   pnpm's `.pnpm/@devopsnext+starterkit-them_<hash>/…` store, and that hash
   shifts with the dependency graph — printing it would make `--check` flag
   drift that is not about a single token changing. The package subpath is
   the stable, human name for the same file; --source= still gets the
   relative-path treatment, for a sibling checkout or any other local file. */
const sourceLabel = isRemote
  ? SOURCE
  : usingDefaultSource
    ? PACKAGE_SUBPATH
    : relative(ROOT, SOURCE).split(sep).join("/") || SOURCE;

const START = "/* @tokens:start — generated by scripts/sync-tokens.mjs, do not edit */";
const END = "/* @tokens:end */";

/* The sheet publishes its light scheme under MUI's attribute. */
const LIGHT_SELECTOR = '[data-mui-color-scheme="light"]';
const ALIAS = "--ib-t-";

/** Body of the first top-level `selector { … }`, by brace matching. */
function ruleBody(css, selector) {
  const at = css.indexOf(selector + " {");
  if (at === -1) throw new Error(`selector not found in token sheet: ${selector}`);
  const open = css.indexOf("{", at);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i);
  }
  throw new Error(`unterminated rule: ${selector}`);
}

/** Custom properties only, in source order. Comments and `color-scheme:` dropped. */
function customProps(body) {
  const out = new Map();
  let depth = 0;
  let buf = "";
  const flush = () => {
    const decl = buf.replace(/\/\*[\s\S]*?\*\//g, "").trim();
    buf = "";
    const split = decl.indexOf(":");
    if (split === -1) return;
    const name = decl.slice(0, split).trim();
    if (name.startsWith("--")) out.set(name, decl.slice(split + 1).trim().replace(/\s+/g, " "));
  };
  for (const ch of body) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === ";" && depth === 0) flush();
    else buf += ch;
  }
  flush();
  return out;
}

/**
 * Inline a vendored default for every var() inside a vendored value, so the
 * default stands on its own. `seen` breaks a cycle in the source sheet rather
 * than recursing forever.
 */
function selfContained(value, lookup, seen = new Set()) {
  return value.replace(/var\(\s*(--[\w-]+)\s*\)/g, (whole, name) => {
    if (seen.has(name)) return whole;
    const inner = lookup(name);
    if (inner === undefined) return whole;
    return `var(${name}, ${selfContained(inner, lookup, new Set([...seen, name]))})`;
  });
}

if (!isRemote && !existsSync(SOURCE)) {
  throw new Error(
    `token sheet missing: ${SOURCE}\n` +
      "This script reads @devopsnext/starterkit-theme's installed preset sheet by default, so it " +
      "needs the package installed. Run `pnpm install`, or point --source= at a preset sheet elsewhere.",
  );
}

const sheet = isRemote
  ? await fetch(SOURCE).then((res) => {
      if (!res.ok) throw new Error(`${SOURCE} → HTTP ${res.status}`);
      return res.text();
    })
  : readFileSync(SOURCE, "utf8");

const dark = customProps(ruleBody(sheet, ":root"));
const light = customProps(ruleBody(sheet, LIGHT_SELECTOR));

const current = readFileSync(TARGET, "utf8");
const head = current.indexOf(START);
const tail = current.indexOf(END);
if (head === -1 || tail === -1) throw new Error("token markers missing from styles.css");

/* Seeds from the hand-written CSS only — the generated block is cut out first so
   an alias cannot keep itself alive by being referenced by its own siblings. */
const handWritten = current.slice(0, head) + current.slice(tail + END.length);
const used = new Set(
  [...new Set(handWritten.match(new RegExp(String.raw`${ALIAS}[\w-]+`, "g")) ?? [])].map(
    (alias) => "--" + alias.slice(ALIAS.length),
  ),
);

const missing = [...used].filter((name) => !dark.has(name));
if (missing.length) throw new Error(`consumed but absent from the token sheet: ${missing.join(", ")}`);

/* Emit in the sheet's own order — it groups by role (palette, text, borders,
   radii, channels), which reads better than alphabetical and is just as stable. */
const seeds = [...dark.keys()].filter((name) => used.has(name));

const darkOf = (name) => dark.get(name);
const lightOf = (name) => light.get(name) ?? dark.get(name);

const declare = (name, lookup, indent) =>
  `${indent}${ALIAS}${name.slice(2)}: var(${name}, ${selfContained(lookup(name), lookup)});`;

const darkBlock = seeds.map((name) => declare(name, darkOf, "  ")).join("\n");

/* A token earns a light declaration when its vendored default actually differs
   there — either it is redefined, or something it references is. */
const flipped = seeds.filter((name) => declare(name, darkOf, "") !== declare(name, lightOf, ""));

const lightBlock = (indent) => flipped.map((name) => declare(name, lightOf, indent)).join("\n");

const block = `${START}
/* Source: ${sourceLabel} — regenerate with \`pnpm sync:tokens\`.
   Each alias is \`var(<host token>, <vendored default>)\`: the host's sheet wins
   whenever it defines the token, these values render the button when it does
   not. Scoped to .ib-btn — this file declares nothing on :root. */

.ib-btn {
${darkBlock}
}

/* Light scheme. Every family redefines its own channel and text token against
   its own scheme's --surface, so this block is a second, independent set of
   values rather than a computed flip of the dark one. */
${LIGHT_SELECTOR} .ib-btn,
[data-theme="light"] .ib-btn {
${lightBlock("  ")}
}

/* Same defaults for a host that ships no scheme attribute at all. Scoped to a
   root carrying neither: without that guard, a host running dark mode on a
   light-preference machine would pick these up. */
@media (prefers-color-scheme: light) {
  :root:not([data-mui-color-scheme]):not([data-theme]) .ib-btn {
${lightBlock("    ")}
  }
}
${END}`;

/* The block above is built with \n, but styles.css is CRLF in a Windows
   checkout (git's core.autocrlf converts on the way out). Splicing LF into a
   CRLF file leaves `next !== current` no matter what the tokens say — so
   `--check` reports drift that does not exist and a rewrite churns line
   endings rather than values. Match whatever the file already uses. */
const eol = current.includes("\r\n") ? "\r\n" : "\n";

const next = current.slice(0, head) + block.replace(/\n/g, eol) + current.slice(tail + END.length);

if (process.argv.includes("--check")) {
  if (next !== current) {
    console.error("styles.css tokens are stale — run `pnpm sync:tokens`");
    process.exit(1);
  }
  console.log(`tokens up to date (${seeds.length} aliased, ${flipped.length} flip in light)`);
} else {
  writeFileSync(TARGET, next);
  console.log(`synced ${seeds.length} tokens from ${sourceLabel} (${flipped.length} flip in light)`);
}
