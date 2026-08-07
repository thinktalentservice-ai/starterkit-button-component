import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/* ═══════════════════════════════════════════════════════════════════════════
   Regression coverage for the light-mode --ib-light-* shadowing bug fixed in
   1.0.1: `--ib-light-mint` (and its four siblings) sat BETWEEN the public
   `--ib-accent-*` override and the host token in the transparent-fill
   fallback chain, so in light mode a hand-written literal beat an injected
   host brand outright — invisibly, because dark mode never consulted that
   layer. Every host but Obsidian got olive-green outline/bare buttons.

   jsdom (this repo's `pnpm test` vitest suite) cannot cascade custom
   properties or resolve var() chains — it passed 30/30 while the bug was
   live and always would. Only a real browser engine can prove a fallback
   chain resolves the way the source claims it does, which is what this file
   does: render every tone's transparent fills, inject a brand override the
   same way a real SSR-delivered <style id="brand-vars"> block arrives
   (appended to <head>, after this package's own styles.css), and read the
   *computed* label colour out of the CSSOM — not the cascade, the result.
   ═══════════════════════════════════════════════════════════════════════════ */

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const STYLES_CSS = readFileSync(join(ROOT, "styles.css"), "utf8");

const BRAND_HEX = "#0B5FFF";
const BRAND_CHANNEL = "11 95 255"; // #0B5FFF as an R G B triple, for the one chain that reads a *-channel token directly
const BRAND_RGB = [11, 95, 255];

type ToneCase = {
  tone: string;
  /** Raw host token the LIGHT-scheme --ib-light-* chain ultimately falls back to. */
  lightSeed: string;
  /** Raw host token the DARK-scheme chain ultimately falls back to. */
  darkSeed: string;
  /** True when darkSeed is a "R G B" channel triple rather than a hex colour. */
  darkIsChannel?: boolean;
  /** Known-good vendored defaults today, hex, for the baseline assertion. */
  baseline: { light: string; dark: string };
};

const TONES: ToneCase[] = [
  { tone: "mint", lightSeed: "--mint", darkSeed: "--mint-text", baseline: { light: "#6B7D20", dark: "#C8E05E" } },
  { tone: "violet", lightSeed: "--electric", darkSeed: "--electric-text", baseline: { light: "#7c3aed", dark: "#a78bfa" } },
  { tone: "amber", lightSeed: "--amber-deep", darkSeed: "--amber-text", baseline: { light: "#b45309", dark: "#fbbf24" } },
  {
    tone: "danger",
    lightSeed: "--rose-deep",
    darkSeed: "--rose-channel",
    darkIsChannel: true,
    baseline: { light: "#e11d48", dark: "#f43f5e" },
  },
  { tone: "blue", lightSeed: "--cobalt-deep", darkSeed: "--cobalt-text", baseline: { light: "#005fb8", dark: "#4DB3FF" } },
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

    for (const { tone, lightSeed, darkSeed, darkIsChannel } of TONES) {
      test(`injected brand reaches --ib-accent for ${tone}`, async ({ page }) => {
        await page.setContent(fixtureHtml(scheme));

        const before = parseRgb(await labelColor(page, `outline-${tone}`));

        const seedVar = scheme === "light" ? lightSeed : darkSeed;
        const seedValue = scheme === "dark" && darkIsChannel ? BRAND_CHANNEL : BRAND_HEX;
        // Same mechanism the real SSR delivery uses: a <style> appended after
        // this package's own styles.css, targeting :root — a brand's actual
        // rule additionally scopes to [data-mui-color-scheme="light"], but
        // :root alone is sufficient and sharper for this regression: it
        // isolates "does the fallback chain follow an inherited host token
        // at all" from any scheme-selector-scoping question.
        await page.addStyleTag({ content: `:root { ${seedVar}: ${seedValue}; }` });

        const afterOutline = parseRgb(await labelColor(page, `outline-${tone}`));
        const afterBare = parseRgb(await labelColor(page, `bare-${tone}`));

        expect(afterOutline, `${scheme}/${tone} outline must follow the injected brand`).toEqual(BRAND_RGB);
        expect(afterBare, `${scheme}/${tone} bare must follow the injected brand`).toEqual(BRAND_RGB);
        expect(afterOutline, `${scheme}/${tone} must actually have changed from baseline`).not.toEqual(before);
      });
    }
  });
}
