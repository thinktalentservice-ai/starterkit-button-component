# @ib/button

The Obsidian design-system button, extracted from the Next.js starterkit into a standalone package.

Zero runtime dependencies. React is a peer dep. All styling is CSS — the component renders data attributes and nothing else.

```bash
pnpm add @ib/button
```

```jsx
import { Button } from "@ib/button";
import "@ib/button/styles.css"; // once, at your app root

<Button tone="mint" fill="solid" size="lg">Deploy</Button>
<Button variant="ghost" startIcon={<Icon />}>Cancel</Button>
<Button href="/docs" variant="pill">Read the docs</Button>
<Button loading>Saving…</Button>
```

## Four orthogonal axes

There is no variant lookup table. Every visual decision belongs to exactly one axis, so a new tone costs one CSS rule and combines with every fill for free.

| Axis    | Values                                                     | Default  |
| ------- | ---------------------------------------------------------- | -------- |
| `tone`  | `mint` `violet` `amber` `danger` `blue` `neutral`           | `mint`   |
| `fill`  | `solid` `ghost` `outline` `bare` `translucent`              | `solid`  |
| `shape` | `chip` `pill`                                              | `chip`   |
| `size`  | `sm` `md` `lg`                                             | `md`     |

A `tone` publishes `--ib-ch` (an `r g b` channel triplet), `--ib-grad` and `--ib-accent`. A `fill` consumes them and knows nothing about which tone supplied them. `translucent` is deliberately tone-independent — it is white-on-whatever, for use on top of a coloured surface.

### Presets

`variant` is a named alias for a point in axis space. It is a convenience layer, never a source of styling — `variant="pill"` and `tone="blue" fill="outline" shape="pill"` produce byte-identical DOM. Explicit axis props win over the preset.

| `variant`     | equals                                       |
| ------------- | -------------------------------------------- |
| `mint`        | `tone=mint fill=solid`                       |
| `violet`      | `tone=violet fill=solid`                     |
| `amber`       | `tone=amber fill=solid`                      |
| `danger`      | `tone=danger fill=solid`                     |
| `blue`        | `tone=blue fill=solid`                       |
| `ghost`       | `tone=neutral fill=ghost`                    |
| `text`        | `tone=neutral fill=bare`                     |
| `pill`        | `tone=blue fill=outline shape=pill`          |
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

`styles.css` ships standalone fallbacks for every token inside `@layer ib-button-tokens`. An **unlayered** rule always beats a layered one regardless of specificity or source order, so a host design system that defines these in plain CSS wins automatically — there is no "import this first" rule to get wrong. The component rules themselves are deliberately *unlayered*, so they beat unlayered global resets such as Bootstrap's `button {}` on specificity.

Tokens read: `--{mint,electric,amber,rose,cobalt,white,fg1}-channel` · `--gradient-{primary,secondary,amber,danger,cobalt}` · `--{mint,electric,amber,cobalt}-text` · `--fg1` `--fg2` `--fg-muted` `--border` · `--btn-ghost-bg{,-hover}` `--btn-outline-border{,-hover}` · `--radius-chip` `--radius-pill` · `--font-body`

Override `--ib-btn-focus-ring` to control the focus ring colour.

## Why no JS styling

The pre-extraction component drove hover with `onMouseOver`/`onMouseOut` and mutated `e.currentTarget.style` directly. That approach:

- **loses events.** Fast pointer movement or a re-render mid-hover leaves the button stuck in its hover look.
- **cannot express `:active`.** There is no reasonable JS equivalent.
- **cannot express `:focus-visible`.** `onFocus` fires for mouse clicks too, so a JS focus ring punishes mouse users while telling you nothing about keyboard navigation. Moving to CSS is an accessibility fix, not a refactor.

The only JS-computed attribute is `data-interactive`, which is state rather than style: CSS rules gate on `[data-interactive]:hover` instead of repeating `:not(:disabled):not([aria-disabled="true"]):not([data-loading])` on every hover rule.

## Accessibility

- `:focus-visible` ring with a 2px offset. Solid fills ring in `--fg1` because a mint ring on a mint gradient is invisible.
- A disabled `<a>` is inert **by construction** — `<a>` ignores the `disabled` attribute, so the href is dropped, `onClick` is detached, `tabIndex` is forced to `-1`, `aria-disabled` is set, and `pointer-events` is killed in CSS. A caller-supplied `tabIndex` cannot resurrect it.
- `prefers-reduced-motion`: transitions and the press offset are removed; the spinner is *slowed*, not stopped, because it carries state rather than decoration.
- `forced-colors`: a system `ButtonText` border restores the affordance the OS strips along with the gradient. No `forced-color-adjust` override — the user's palette wins.
- `min-height` per size keeps every button at or above the WCAG 2.5.8 target minimum.

## Development

```bash
pnpm install
pnpm verify      # tsc --noEmit && vitest run && tsup
```

`tsc` in strict mode is the type gate; there is no ESLint here on purpose — the version pinned in the consuming starterkit is broken, and a second lint config that disagrees with it is worse than none.

The test suite asserts behaviour and the DOM contract the CSS selects on, not appearance. Rename `data-fill` and every rule in `styles.css` silently stops matching — no type checker catches that, so the tests pin it.

## Not in v1

`IconButton` is still in the starterkit. Its `.obsidian-icon-btn` class lives in a topbar layout stylesheet and it depends on `motion` for press/hover. Extracting it means lifting that class out and reimplementing press/hover in CSS so consumers take no extra dependency. Tracked as v2.
