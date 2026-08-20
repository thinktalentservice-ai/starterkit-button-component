/**
 * The button has four orthogonal axes. Nothing else.
 *
 * Every visual decision belongs to exactly one axis, which is why there is no
 * variant lookup table in this package: a table that mixes colour identity with
 * shape (the old `pill` "variant") grows a new row every time a screenshot needs
 * matching, and no two rows stay consistent. Axes cannot rot that way — adding a
 * tone costs one CSS rule and combines with every fill for free.
 *
 * tone  → colour identity. Publishes `--ib-ch` (an "r g b" channel triplet) and
 *         `--ib-grad` for the fills to consume.
 * fill  → how that identity is applied to the surface.
 * shape → corner geometry. Independent of colour.
 * size  → padding / type scale / minimum hit target.
 */

export type ButtonTone =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "neutral";
export type ButtonFill = "solid" | "ghost" | "outline" | "bare" | "translucent";
export type ButtonShape = "chip" | "pill";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonAxes {
  tone: ButtonTone;
  fill: ButtonFill;
  shape: ButtonShape;
}

export const DEFAULT_AXES: ButtonAxes = { tone: "primary", fill: "solid", shape: "chip" };

/**
 * Presets are a convenience alias layer — a named point in axis space, never a
 * source of styling. `variant="pill"` and `tone="primary" fill="outline"
 * shape="pill"` produce byte-identical DOM; the preset only fills in axes the
 * caller left unset.
 */
export const PRESETS = {
  primary: { tone: "primary", fill: "solid" },
  secondary: { tone: "secondary", fill: "solid" },
  accent: { tone: "accent", fill: "solid" },
  success: { tone: "success", fill: "solid" },
  warning: { tone: "warning", fill: "solid" },
  danger: { tone: "danger", fill: "solid" },
  ghost: { tone: "neutral", fill: "ghost" },
  text: { tone: "neutral", fill: "bare" },
  pill: { tone: "primary", fill: "outline", shape: "pill" },
  "pill-filled": { tone: "neutral", fill: "translucent", shape: "pill" },
} as const satisfies Record<string, Partial<ButtonAxes>>;

export type ButtonPreset = keyof typeof PRESETS;

// Declared locally rather than pulling in @types/node: this is a browser
// package, and every bundler replaces process.env.NODE_ENV at build time. The
// typeof guard keeps it safe in a runtime that has no `process` at all — at the
// cost of staying quiet there, which is the right way to fail for a warning.
declare const process: { env?: Record<string, string | undefined> } | undefined;

const isDev = () => typeof process !== "undefined" && process?.env?.NODE_ENV !== "production";

const warned = new Set<string>();

/**
 * Explicit axis props always beat the preset, and the preset always beats the
 * default. Unknown preset strings (this package is consumed from plain JS as
 * well as TS) degrade to the defaults instead of rendering an unstyled button.
 *
 * Degrading silently is not good enough on its own: `variant="dnager"` would
 * render a perfectly normal primary button and nothing would ever say why. This
 * package dropped prop-types in favour of compile-time types, so a JS caller
 * has no other backstop — hence a dev-only warning, once per bad value. Valid
 * presets never warn; they are supported API, not deprecated.
 */
export function resolveAxes(
  explicit: Partial<ButtonAxes>,
  preset: ButtonPreset | undefined,
): ButtonAxes {
  if (preset !== undefined && PRESETS[preset] === undefined && isDev() && !warned.has(preset)) {
    warned.add(preset);
    console.warn(
      `[@devopsnext/starterkit-button-component] Unknown variant "${preset}" — falling back to ` +
        `tone="${DEFAULT_AXES.tone}" fill="${DEFAULT_AXES.fill}". ` +
        `Valid: ${Object.keys(PRESETS).join(", ")}. ` +
        `Or set tone/fill/shape directly.`,
    );
  }

  const base: Partial<ButtonAxes> = (preset && PRESETS[preset]) || {};
  return {
    tone: explicit.tone ?? base.tone ?? DEFAULT_AXES.tone,
    fill: explicit.fill ?? base.fill ?? DEFAULT_AXES.fill,
    shape: explicit.shape ?? base.shape ?? DEFAULT_AXES.shape,
  };
}
