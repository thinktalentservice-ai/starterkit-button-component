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

export type ButtonTone = "mint" | "violet" | "amber" | "danger" | "blue" | "neutral";
export type ButtonFill = "solid" | "ghost" | "outline" | "bare" | "translucent";
export type ButtonShape = "chip" | "pill";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonAxes {
  tone: ButtonTone;
  fill: ButtonFill;
  shape: ButtonShape;
}

export const DEFAULT_AXES: ButtonAxes = { tone: "mint", fill: "solid", shape: "chip" };

/**
 * Presets are a convenience alias layer — a named point in axis space, never a
 * source of styling. `variant="pill"` and `tone="blue" fill="outline"
 * shape="pill"` produce byte-identical DOM; the preset only fills in axes the
 * caller left unset.
 */
export const PRESETS = {
  mint: { tone: "mint", fill: "solid" },
  violet: { tone: "violet", fill: "solid" },
  amber: { tone: "amber", fill: "solid" },
  danger: { tone: "danger", fill: "solid" },
  blue: { tone: "blue", fill: "solid" },
  ghost: { tone: "neutral", fill: "ghost" },
  text: { tone: "neutral", fill: "bare" },
  pill: { tone: "blue", fill: "outline", shape: "pill" },
  "pill-filled": { tone: "neutral", fill: "translucent", shape: "pill" },
} as const satisfies Record<string, Partial<ButtonAxes>>;

export type ButtonPreset = keyof typeof PRESETS;

/**
 * Explicit axis props always beat the preset, and the preset always beats the
 * default. Unknown preset strings (this package is consumed from plain JS as
 * well as TS) degrade to the defaults instead of rendering an unstyled button.
 */
export function resolveAxes(
  explicit: Partial<ButtonAxes>,
  preset: ButtonPreset | undefined,
): ButtonAxes {
  const base: Partial<ButtonAxes> = (preset && PRESETS[preset]) || {};
  return {
    tone: explicit.tone ?? base.tone ?? DEFAULT_AXES.tone,
    fill: explicit.fill ?? base.fill ?? DEFAULT_AXES.fill,
    shape: explicit.shape ?? base.shape ?? DEFAULT_AXES.shape,
  };
}
