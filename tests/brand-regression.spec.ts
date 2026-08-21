import { test, expect } from "@playwright/test";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/* ═══════════════════════════════════════════════════════════════════════════
   Regression coverage for the host-injected-brand fallback chain that feeds
   the transparent fills' label colour (outline, bare).

   Through 1.x this chain had a SECOND layer: `--ib-light-mint` (and its four
   siblings) sat BETWEEN the public `--ib-accent-*` override and the host
   token, active in light mode only, because the old ABI's `*-text` tokens
   were tuned as accents on a dark surface and were not guaranteed legible on
   a light one. That layer is gone — see the comment above the tone rules in
   styles.css. The 2.0 ABI's `--<family>-text` is defined as ">=4.5:1 on
   --surface" independently per scheme, so `--ib-accent` now has exactly one
   fallback level in both schemes: `var(--ib-accent-<family>, var(--ib-t-<family>-text))`.

   jsdom (this repo's `pnpm test` vitest suite) cannot cascade custom
   properties or resolve var() chains — it would pass while that fallback was
   broken and always would. Only a real browser engine can prove it resolves
   the way the source claims, which is what this file does: render every
   tone's transparent fills, inject a brand override the same way a real
   host's brand stylesheet arrives (appended to <head>, after this package's
   own styles.css), and read the *computed* label colour out of the CSSOM —
   not the cascade, the result.
   ═══════════════════════════════════════════════════════════════════════════ */

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const STYLES_CSS = readFileSync(join(ROOT, "styles.css"), "utf8");

const BRAND_HEX = "#0B5FFF";
const BRAND_RGB = [11, 95, 255];

type ToneCase = {
  tone: string;
  /** Raw host token the --ib-accent chain ultimately falls back to, both schemes. */
  seed: string;
  /** Known-good vendored defaults today, hex, for the baseline assertion. */
  baseline: { light: string; dark: string };
};

const TONES: ToneCase[] = [
  { tone: "primary", seed: "--primary-text", baseline: { light: "#004d83", dark: "#40aaff" } },
  { tone: "secondary", seed: "--secondary-text", baseline: { light: "#252d39", dark: "#738296" } },
  { tone: "accent", seed: "--accent-text", baseline: { light: "#576328", dark: "#c8e063" } },
  { tone: "success", seed: "--success-text", baseline: { light: "#255925", dark: "#6eba67" } },
  { tone: "warning", seed: "--warning-text", baseline: { light: "#8a5a19", dark: "#feb054" } },
  { tone: "danger", seed: "--danger-text", baseline: { light: "#7a1a2c", dark: "#f86278" } },
  { tone: "info", seed: "--info-text", baseline: { light: "#00315b", dark: "#3389d6" } },
  { tone: "accent-green", seed: "--accent-green-text", baseline: { light: "#576328", dark: "#c8e063" } },
  { tone: "accent-pink", seed: "--accent-pink-text", baseline: { light: "#771d3e", dark: "#f26594" } },
];

function hexToRgb(hex: string): number[] {
  const m = hex.replace("#", "");
  return [m.slice(0, 2), m.slice(2, 4), m.slice(4, 6)].map((h) => parseInt(h, 16));
}

function parseRgb(computed: string): number[] {
  const m = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) throw new Error(`unparseable computed colour: ${computed}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function fixtureHtml(scheme: "light" | "dark"): string {
  // Explicit on both schemes, not just light: the CSS's dark values are the
  // unconditional default, so an ABSENT attribute plus Chromium's default
  // `prefers-color-scheme: light` would hit the same `@media` fallback the
  // light fixture uses and silently test light twice. Real hosts (MUI's
  // CssVarsProvider) always stamp a concrete value anyway.
  const buttons = TONES.map(
    ({ tone }) => `
    <button class="ib-btn" data-tone="${tone}" data-fill="outline" data-size="md" id="outline-${tone}">${tone}</button>
    <button class="ib-btn" data-tone="${tone}" data-fill="bare" data-size="md" id="bare-${tone}">${tone}</button>`,
  ).join("");
  // transition: none — .ib-btn animates `color` over 0.2s; reading
  // getComputedStyle right after an injected brand lands mid-transition
  // otherwise, which is a real bug in the *test*, not the component.
  return `<!doctype html><html data-mui-color-scheme="${scheme}"><head><style>${STYLES_CSS}</style><style>.ib-btn { transition: none !important; }</style></head><body>${buttons}</body></html>`;
}

async function labelColor(page: import("@playwright/test").Page, id: string): Promise<string> {
  return page.locator(`#${id}`).evaluate((el) => getComputedStyle(el).color);
}

for (const scheme of ["dark", "light"] as const) {
  test.describe(`${scheme} scheme`, () => {
    test("baseline: unbranded transparent fills render today's vendored defaults", async ({ page }) => {
      await page.setContent(fixtureHtml(scheme));
      for (const { tone, baseline } of TONES) {
        const expected = hexToRgb(baseline[scheme]);
        for (const fill of ["outline", "bare"] as const) {
          const actual = parseRgb(await labelColor(page, `${fill}-${tone}`));
          expect(actual, `${scheme}/${tone}/${fill} baseline`).toEqual(expected);
        }
      }
    });

    for (const { tone, seed } of TONES) {
      test(`injected brand reaches --ib-accent for ${tone}`, async ({ page }) => {
        await page.setContent(fixtureHtml(scheme));

        const before = parseRgb(await labelColor(page, `outline-${tone}`));

        // Same mechanism the real host delivery uses: a <style> appended
        // after this package's own styles.css, targeting :root — a brand's
        // actual rule additionally scopes to [data-mui-color-scheme="light"],
        // but :root alone is sufficient and sharper for this regression: it
        // isolates "does the fallback chain follow an inherited host token
        // at all" from any scheme-selector-scoping question. One seed token
        // now covers both schemes — the family's `-text` token is the same
        // name in dark and light, only its vendored default differs.
        await page.addStyleTag({ content: `:root { ${seed}: ${BRAND_HEX}; }` });

        const afterOutline = parseRgb(await labelColor(page, `outline-${tone}`));
        const afterBare = parseRgb(await labelColor(page, `bare-${tone}`));

        expect(afterOutline, `${scheme}/${tone} outline must follow the injected brand`).toEqual(BRAND_RGB);
        expect(afterBare, `${scheme}/${tone} bare must follow the injected brand`).toEqual(BRAND_RGB);
        expect(afterOutline, `${scheme}/${tone} must actually have changed from baseline`).not.toEqual(before);
      });
    }
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   BRAND PARITY — the workshop's two starterkit-theme presets.

   The tests above prove the fallback chain follows *a* host token. These prove
   it follows the *right* one: that .storybook/brands.generated.css, which
   rewrites each preset's `:root` into `[data-brand="<id>"]`, still delivers
   that preset's own values once a browser has resolved the compound selectors
   and the alias chain on top of them.

   Two things make this worth a browser rather than a string comparison:

   1. The light rules are COMPOUND — `[data-brand="x"][data-mui-color-scheme=
      "light"]` — so they match only when both attributes sit on one element. A
      refactor that moved the brand attribute up to a wrapper would still look
      correct in the CSS and would silently serve dark tokens in light mode.
   2. `--<family>-on-solid` is the sharpest signal in the sheet. It is a
      MEASURED ink, not a derived one: Think's blue takes #0b0f19, Elemetrik's
      violet takes #ffffff. Nothing in this package computes that, so if solid
      labels come out right under both brands, brand tokens are genuinely
      reaching the button rather than a vendored default happening to agree.

   Expectations are READ from the preset source at run time, not tabled. The
   hard-coded TONES baseline above is hand-maintained on purpose — it pins the
   vendored defaults, which have no machine-readable source. These do have one,
   so tabling them would only add a second place to forget to update.
   ═══════════════════════════════════════════════════════════════════════════ */

const BRANDS_CSS = readFileSync(join(ROOT, ".storybook", "brands.generated.css"), "utf8");

/* Prefer the sibling theme checkout when it is present: reading the ORIGINAL
   preset makes this a test of the rewrite itself. Falling back to the generated
   file keeps the suite runnable where only this repo is checked out — weaker,
   but it still covers selector matching, inheritance and the alias chain, which
   is the part that needs a browser. */
const PRESETS_DIR = join(ROOT, "..", "starterkit-theme", "presets");
const FROM_UPSTREAM = existsSync(join(PRESETS_DIR, "think.css"));

const BRAND_IDS = ["think", "elemetrik"] as const;
type BrandId = (typeof BRAND_IDS)[number];

/** Body of the first `<selector> … {` … `}`, by brace matching. */
function ruleBody(css: string, selector: string): string {
  const at = css.indexOf(selector);
  if (at === -1) throw new Error(`selector not found: ${selector}`);
  const open = css.indexOf("{", at);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i);
  }
  throw new Error(`unterminated rule: ${selector}`);
}

function customProps(body: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const decl of body.split(";")) {
    const split = decl.indexOf(":");
    if (split === -1) continue;
    const name = decl.slice(0, split).trim();
    if (name.startsWith("--")) out.set(name, decl.slice(split + 1).trim());
  }
  return out;
}

type BrandMaps = { dark: Map<string, string>; light: Map<string, string> };

function expectedTokens(brand: BrandId): BrandMaps {
  if (FROM_UPSTREAM) {
    const sheet = readFileSync(join(PRESETS_DIR, `${brand}.css`), "utf8");
    return {
      dark: customProps(ruleBody(sheet, ":root {")),
      light: customProps(ruleBody(sheet, '[data-mui-color-scheme="light"] {')),
    };
  }
  return {
    dark: customProps(ruleBody(BRANDS_CSS, `[data-brand="${brand}"] {`)),
    light: customProps(
      ruleBody(BRANDS_CSS, `[data-brand="${brand}"][data-mui-color-scheme="light"]`),
    ),
  };
}

/* The light block redeclares only what actually changes, so an absent token
   means "same as dark" — notably every `-on-solid`, which is scheme-invariant
   by design: the fill is the brand's seed hex in both schemes. */
function tokenFor(maps: BrandMaps, scheme: "light" | "dark", name: string): string {
  const value = scheme === "light" ? (maps.light.get(name) ?? maps.dark.get(name)) : maps.dark.get(name);
  if (!value) throw new Error(`${name} absent from the preset sheet`);
  return value;
}

function brandFixtureHtml(brand: BrandId, scheme: "light" | "dark"): string {
  const buttons = TONES.map(
    ({ tone }) => `
    <button class="ib-btn" data-tone="${tone}" data-fill="solid" data-size="md" id="solid-${tone}">${tone}</button>
    <button class="ib-btn" data-tone="${tone}" data-fill="outline" data-size="md" id="outline-${tone}">${tone}</button>`,
  ).join("");
  // Brand sheet FIRST, the order .storybook/preview.tsx imports them in, and
  // both attributes on <html> so the compound light selector can match at all.
  return `<!doctype html><html data-brand="${brand}" data-mui-color-scheme="${scheme}" data-theme="${scheme}"><head><style>${BRANDS_CSS}</style><style>${STYLES_CSS}</style><style>.ib-btn { transition: none !important; }</style></head><body>${buttons}</body></html>`;
}

for (const brand of BRAND_IDS) {
  for (const scheme of ["dark", "light"] as const) {
    test.describe(`${brand} / ${scheme}`, () => {
      test("the brand sheet is the one in scope", async ({ page }) => {
        await page.setContent(brandFixtureHtml(brand, scheme));
        const stamped = await page.evaluate(() =>
          getComputedStyle(document.documentElement).getPropertyValue("--tokens-brand").trim(),
        );
        // Quoted at source (`--tokens-brand: "think"`), and the CSSOM hands the
        // quotes back verbatim.
        expect(stamped).toBe(`"${brand}"`);
      });

      test("solid labels use the brand's measured ink", async ({ page }) => {
        await page.setContent(brandFixtureHtml(brand, scheme));
        const maps = expectedTokens(brand);
        for (const { tone } of TONES) {
          const want = hexToRgb(tokenFor(maps, scheme, `--${tone}-on-solid`));
          const got = parseRgb(await labelColor(page, `solid-${tone}`));
          expect(got, `${brand}/${scheme}/${tone} solid ink`).toEqual(want);
        }
      });

      test("outline labels use the brand's text token", async ({ page }) => {
        await page.setContent(brandFixtureHtml(brand, scheme));
        const maps = expectedTokens(brand);
        for (const { tone, seed } of TONES) {
          const want = hexToRgb(tokenFor(maps, scheme, seed));
          const got = parseRgb(await labelColor(page, `outline-${tone}`));
          expect(got, `${brand}/${scheme}/${tone} outline label`).toEqual(want);
        }
      });
    });
  }
}

/* The two brands must not merely both work — they must DIFFER. Without this, a
   rewrite that emitted the same block twice under two names would satisfy every
   assertion above. */
test("the two brands render differently", async ({ page }) => {
  const read = async (brand: BrandId) => {
    await page.setContent(brandFixtureHtml(brand, "light"));
    return Promise.all(TONES.map(({ tone }) => labelColor(page, `solid-${tone}`)));
  };
  expect(await read("think")).not.toEqual(await read("elemetrik"));
});
