# @devopsnext/starterkit-button-component

The Obsidian design-system button, extracted from the Next.js starterkit into a standalone package.

Zero runtime dependencies. React is a peer dep. All styling is CSS — the component renders data attributes and nothing else.

[View the live Storybook](https://thinktalentservice-ai.github.io/starterkit-button-component/)

```bash
pnpm add @devopsnext/starterkit-button-component
```

```jsx
import { Button } from "@devopsnext/starterkit-button-component";
import "@devopsnext/starterkit-button-component/styles.css"; // once, at your app root

<Button tone="primary" fill="solid" size="lg">Deploy</Button>
<Button variant="ghost" startIcon={<Icon />}>Cancel</Button>
<Button href="/docs" variant="pill">Read the docs</Button>
<Button loading>Saving…</Button>
```

## Four orthogonal axes

There is no variant lookup table. Every visual decision belongs to exactly one axis, so a new tone costs one CSS rule and combines with every fill for free.

| Axis    | Values                                                                  | Default   |
| ------- | ------------------------------------------------------------------------ | --------- |
| `tone`  | `primary` `secondary` `accent` `success` `warning` `danger` `info` `accent-green` `accent-pink` `neutral` | `primary` |
| `fill`  | `solid` `ghost` `outline` `bare` `translucent`                           | `solid`   |
| `shape` | `chip` `pill`                                                             | `chip`    |
| `size`  | `sm` `md` `lg`                                                            | `md`      |

A `tone` publishes `--ib-ch` (an `r g b` channel triplet), `--ib-grad`, `--ib-on-solid` and `--ib-accent`. A `fill` consumes them and knows nothing about which tone supplied them.

One combination is contextual rather than universal: `translucent` is deliberately tone-independent — white-on-whatever by default, sized for sitting **on top of a coloured surface** (a gradient hero, a featured card). On a light page background it is white-on-white and will disappear unless the label is repointed with `--ib-on-translucent` (see below). That is a property of the fill, not a bug to fix in CSS; the package cannot know what is behind it.

### Presets

`variant` is a named alias for a point in axis space. It is a convenience layer, never a source of styling — `variant="pill"` and `tone="primary" fill="outline" shape="pill"` produce byte-identical DOM. Explicit axis props win over the preset.

| `variant`     | equals                                       |
| ------------- | -------------------------------------------- |
| `primary`     | `tone=primary fill=solid`                    |
| `secondary`   | `tone=secondary fill=solid`                  |
| `accent`      | `tone=accent fill=solid`                     |
| `success`     | `tone=success fill=solid`                    |
| `warning`     | `tone=warning fill=solid`                    |
| `danger`      | `tone=danger fill=solid`                     |
| `info`        | `tone=info fill=solid`                       |
| `accent-green`| `tone=accent-green fill=solid`               |
| `accent-pink` | `tone=accent-pink fill=solid`                |
| `ghost`       | `tone=neutral fill=ghost`                    |
| `text`        | `tone=neutral fill=bare`                     |
| `pill`        | `tone=primary fill=outline shape=pill`       |
| `pill-filled` | `tone=neutral fill=translucent shape=pill`   |

## Other props

| Prop                    | Notes                                                                          |
| ----------------------- | ------------------------------------------------------------------------------ |
| `loading`               | Spinner, `aria-busy`, interaction blocked. Keeps its own colour — busy, not dead. |
| `disabled`              | Dead state. Solid fills keep a wash of their own hue so identity survives.       |
| `fullWidth`             | `width: 100%` via `data-full-width`.                                            |
| `startIcon` / `endIcon` | Both hidden while loading.                                                      |
| `href`                  | Renders `<a>`. The prop type is discriminated on it: with `href` you get anchor attributes (`target`, `rel`, `download`), without it you get `type`. |
| `ref`                   | Forwarded to the underlying `<button>` or `<a>`.                                |

Anything else is forwarded to the underlying element.

## Token contract

**Your token source is primary; `styles.css` is the backup.** Every token the component reads is aliased once on `.ib-btn` as `var(--your-token, <vendored default>)`. A CSS fallback applies only to an *absent* custom property, so wherever you define the token it wins — no import order to get right, no `@layer`, and nothing you have to load first. Where you don't define it, the vendored value renders the button anyway.

`styles.css` declares **nothing on `:root`** and imports nothing. It will not hand your page a `--border` or a `--font-body`, and it makes no network request. Component rules are deliberately *unlayered*, so they beat unlayered global resets such as Bootstrap's `button {}` on specificity.

The vendored defaults are a generated copy of the design system's token sheet — `pnpm sync:tokens` refetches it from the CDN, `pnpm sync:tokens:check` fails when the copy has drifted. Only tokens the CSS actually uses are vendored; the seed list is scraped from `styles.css` itself, so it cannot fall out of date. If your app already loads that sheet, every default is overridden and none of this is reachable.

Tokens read, per colour family (`primary` `secondary` `accent` `success` `warning` `danger` `info` `accent-green` `accent-pink`): `--{family}-channel` · `--gradient-{family}` · `--{family}-text` · `--{family}-on-solid`. Plus the neutral/structural set: `--fg1` `--fg2` `--fg-muted` `--border` · `--btn-ghost-bg{,-hover}` `--btn-outline-border{,-hover}` · `--radius-chip` `--radius-pill` · `--font-body` `--white-channel`.

Light mode is keyed off `[data-mui-color-scheme="light"]` (what the design system's sheet uses) **or** `[data-theme="light"]` on any ancestor; with neither attribute present, `prefers-color-scheme` decides.

The Storybook toolbar carries a **Light/Dark** button that exercises both attributes. It writes them to `<html>`, not only to the story wrapper — with `<html>` left bare the `prefers-color-scheme` fallback above still matches, so on a machine set to light appearance every button would render light tokens while the workshop claimed to be dark. `?globals=scheme:dark` reproduces the dark state as a shareable link.

Tokens the package owns rather than borrows:

- `--ib-btn-focus-ring` — focus ring colour. Unset by default.
- `--ib-accent-{primary,secondary,accent,success,warning,danger,info,accent-green,accent-pink}` — the label colour used by the transparent fills (`outline`, `bare`), in **both** schemes. Through 1.x this override only mattered in light mode, because the old ABI's `*-text` tokens were tuned as accents on a dark surface and were not guaranteed legible on a light one — two of the old hue-named accents measured as low as roughly 1.7:1 and 2.2:1 on white. The 2.0 ABI's `--{family}-text` is defined as ">=4.5:1 on `--surface`" independently per scheme, so the vendored default is already legible everywhere; this override exists purely for a brand that wants a different accent than its own `-text` token.
- `--ib-on-grad` — label colour for `data-fill="solid"` and its loading spinner's highlighted edge. Falls back to the tone's own `--{family}-on-solid` — a MEASURED ink the design system computes per family, legible against both the resting and hovered fill — so a light-first brand's solid buttons are correct without needing this override. Set it directly only to force a different ink for one button.
- `--ib-on-translucent` — label colour for `data-fill="translucent"` and its loading spinner's highlighted edge. Defaults to `#fff`; translucent is deliberately tone-independent (it sits on whatever coloured surface the caller places it on, not a brand token), so this is a plain escape hatch rather than something derived automatically. Override it if your surface is light.

**Known limitation:** the translucent fill's background wash and border, and the loading spinner's un-highlighted ring, read `--white-channel` at low alpha and do not flip with colour scheme — a light-first brand whose translucent surface is also light gets a wash that's nearly invisible. Fixing this needs a scheme-flipping `--overlay-channel` published by the design system's token sheet, which does not exist yet; tracked as follow-up work, not silently patched around here.

## Brands in the workshop

The component depends on no brand. The **workshop** carries two, so you can see the tokens actually move.

`@devopsnext/starterkit-theme` publishes exactly two presets — **Think** and **Elemetrik** (its `PRESET_IDS`) — and each ships as a sheet that owns `:root`. Loading both would be meaningless: whichever came last would win the document. So `scripts/gen-brands.mjs` rewrites them into one addressable sheet:

```
:root                            ->  [data-brand="think"]
[data-mui-color-scheme="light"]  ->  [data-brand="think"][data-mui-color-scheme="light"]
```

Values are copied verbatim; nothing is recomputed, so the workshop cannot show a colour the theme engine would not produce. The result is `.storybook/brands.generated.css`, which is committed.

```bash
pnpm gen:brands          # rewrite from ../starterkit-theme/presets
pnpm gen:brands:check    # report drift
pnpm gen:brands -- --source=<dir>
```

Unlike `sync:tokens:check`, this is a **local gate, not a CI step**: the theme package is not on npm, so the runner has no copy to compare against. That is also why the output is vendored rather than imported — a `file:../starterkit-theme` devDependency would break `pnpm install --frozen-lockfile` in CI.

The generated sheet is **workshop-only**. It is not in `package.json`'s `files`, and nothing in `dist/` references it.

The light rules are *compound* — both attributes on one element — so whatever carries `data-brand` must carry the scheme attribute too. The Storybook decorator puts all of them on `<html>`; the `BrandComparison` story restates them on each column, which is how it shows both brands at once.

**Think is the resting state**, because the vendored defaults in `styles.css` already *are* Think's values — selecting it changes nothing. Elemetrik is the setting that proves brand tokens are reaching the button, and `--{family}-on-solid` is where it is most obvious: solid labels are near-black under Think's blue and white under Elemetrik's violet, because that ink is measured per brand rather than assumed. `tests/brand-regression.spec.ts` asserts exactly that, reading its expectations out of the preset sheets rather than a hard-coded table.

The **Brand** toolbar button sits next to **Light/Dark**; `?globals=brand:elemetrik;scheme:dark` reproduces any of the four states as a shareable link.

## Why no JS styling

The pre-extraction component drove hover with `onMouseOver`/`onMouseOut` and mutated `e.currentTarget.style` directly. That approach:

- **loses events.** Fast pointer movement or a re-render mid-hover leaves the button stuck in its hover look.
- **cannot express `:active`.** There is no reasonable JS equivalent.
- **cannot express `:focus-visible`.** `onFocus` fires for mouse clicks too, so a JS focus ring punishes mouse users while telling you nothing about keyboard navigation. Moving to CSS is an accessibility fix, not a refactor.

The only JS-computed attribute is `data-interactive`, which is state rather than style: CSS rules gate on `[data-interactive]:hover` instead of repeating `:not(:disabled):not([aria-disabled="true"]):not([data-loading])` on every hover rule.

## Accessibility

- `:focus-visible` ring with a 2px offset. Solid fills ring in `--fg1` because a same-hue ring on a same-hue gradient is invisible.
- A disabled `<a>` is inert **by construction** — `<a>` ignores the `disabled` attribute, so the href is dropped, `onClick` is detached, `tabIndex` is forced to `-1`, `aria-disabled` is set, and `pointer-events` is killed in CSS. A caller-supplied `tabIndex` cannot resurrect it.
- `prefers-reduced-motion`: transitions and the press offset are removed; the spinner is *slowed*, not stopped, because it carries state rather than decoration.
- `forced-colors`: a system `ButtonText` border restores the affordance the OS strips along with the gradient. No `forced-color-adjust` override — the user's palette wins.
- `min-height` per size keeps every button at or above the WCAG 2.5.8 target minimum.

## Development

```bash
pnpm install
pnpm verify      # tsc --noEmit && tsc -p tsconfig.playwright.json && vitest run && tsup
pnpm test:brand  # real-browser brand-injection regression suite (Playwright, not part of `verify`)
pnpm storybook   # local component workshop on port 6006
pnpm gen:brands  # rewrite .storybook/brands.generated.css from ../starterkit-theme
pnpm build-storybook  # refresh the GitHub Pages site in docs/
```

`tsc` in strict mode is the type gate; there is no ESLint here on purpose — the version pinned in the consuming starterkit is broken, and a second lint config that disagrees with it is worse than none.

The test suite asserts behaviour and the DOM contract the CSS selects on, not appearance. Rename `data-fill` and every rule in `styles.css` silently stops matching — no type checker catches that, so the tests pin it.

GitHub Pages publishes directly from `main:/docs`. Commit the regenerated `docs/` directory whenever a story or component visual changes.

## Not in v1

`IconButton` is still in the starterkit. Its `.obsidian-icon-btn` class lives in a topbar layout stylesheet and it depends on `motion` for press/hover. Extracting it means lifting that class out and reimplementing press/hover in CSS so consumers take no extra dependency. Tracked as v2.
