import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
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
  { tone: "accent", seed: "--accent-text", baseline: { light: "#6c724f", dark: "#e3f0a6" } },
  { tone: "success", seed: "--success-text", baseline: { light: "#106142", dark: "#56c490" } },
  { tone: "warning", seed: "--warning-text", baseline: { light: "#8a5a19", dark: "#feb054" } },
  { tone: "danger", seed: "--danger-text", baseline: { light: "#7a1a2c", dark: "#f86278" } },
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
