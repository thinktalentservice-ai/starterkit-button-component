"use client";

import { forwardRef } from "react";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ForwardedRef,
  ReactNode,
  Ref,
} from "react";
import { resolveAxes } from "./axes";
import type { ButtonFill, ButtonPreset, ButtonShape, ButtonSize, ButtonTone } from "./axes";

/**
 * This component contains NO styling. Every visual — hover, focus, active,
 * disabled, loading — is a CSS rule in `styles.css`, selected by the data
 * attributes rendered below. That is deliberate:
 *
 *   - `:hover` cannot be faked with onMouseOver/onMouseOut. The handler pair
 *     drops events during fast pointer movement and re-render, leaving a button
 *     stuck in its hover look.
 *   - `:active` has no JS equivalent worth writing.
 *   - `:focus-visible` is impossible in JS. onFocus fires for mouse clicks too,
 *     so a JS focus ring punishes mouse users and tells you nothing about
 *     keyboard navigation. This is an accessibility fix, not a refactor.
 *
 * The only computed attribute is `data-interactive` — pure state, not style. It
 * exists so CSS rules can say `[data-interactive]:hover` instead of repeating
 * `:not(:disabled):not([aria-disabled="true"]):not([data-loading])` on every
 * hover rule.
 */

interface ButtonOwnProps {
  /** Colour identity. Publishes `--ib-ch` / `--ib-grad` to the fill. */
  tone?: ButtonTone;
  /** How the tone is applied to the surface. */
  fill?: ButtonFill;
  /** Corner geometry. Independent of colour. */
  shape?: ButtonShape;
  /** Padding / type scale / minimum hit target. */
  size?: ButtonSize;
  /** Named alias for a point in axis space. Explicit axis props win over it. */
  variant?: ButtonPreset;
  /** Shows the spinner, blocks interaction, sets `aria-busy`. */
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

type NativeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps>;
type NativeAnchorProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof ButtonOwnProps | "href"
>;

/**
 * Discriminated on `href`: pass it and you get an anchor with anchor-only
 * attributes (`target`, `rel`, `download`); omit it and you get a button with
 * `type`. Mixing them is a compile error rather than a silently ignored prop.
 */
export type ButtonProps =
  | (ButtonOwnProps & NativeButtonProps & { href?: never })
  | (ButtonOwnProps & NativeAnchorProps & { href: string });

const cx = (...parts: Array<string | undefined | false>): string =>
  parts.filter(Boolean).join(" ");

function ButtonImpl(
  props: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement | HTMLAnchorElement>,
) {
  const {
    tone,
    fill,
    shape,
    size = "md",
    variant,
    loading = false,
    disabled = false,
    fullWidth = false,
    startIcon,
    endIcon,
    children,
    className,
    href,
    type = "button",
    ...rest
  } = props as ButtonOwnProps &
    NativeButtonProps &
    NativeAnchorProps & { href?: string; type?: "button" | "submit" | "reset" };

  const axes = resolveAxes({ tone, fill, shape }, variant);
  // `off` blocks interaction; `disabled && !loading` is the true dead state that
  // gets the washed-out treatment. A loading button keeps its own colour so the
  // spinner has contrast — it should read busy, not dead.
  const off = disabled || loading;

  const look = {
    className: cx("ib-btn", className),
    "data-tone": axes.tone,
    "data-fill": axes.fill,
    "data-shape": axes.shape,
    "data-size": size,
    ...(loading ? { "data-loading": "", "aria-busy": true } : {}),
    ...(fullWidth ? { "data-full-width": "" } : {}),
    ...(off ? {} : { "data-interactive": "" }),
  };

  const inner = (
    <>
      {loading ? <span className="ib-btn__spinner" aria-hidden="true" /> : startIcon}
      {children}
      {!loading && endIcon}
    </>
  );

  if (href !== undefined) {
    // An anchor ignores the `disabled` attribute, so an "off" link would still
    // navigate, still take focus, and still fire onClick. It is made inert by
    // construction instead: no href, no click handler, out of the tab order,
    // pointer-events killed in CSS, and the state announced to assistive tech.
    // These props are spread LAST so a caller's tabIndex/onClick cannot
    // resurrect a disabled link.
    const { onClick, ...anchorRest } = rest as NativeAnchorProps;
    const stateProps = off
      ? ({ role: "link", "aria-disabled": true, tabIndex: -1 } as const)
      : ({ href, onClick } as const);

    return (
      <a ref={ref as Ref<HTMLAnchorElement>} {...anchorRest} {...look} {...stateProps}>
        {inner}
      </a>
    );
  }

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type={type}
      {...(rest as NativeButtonProps)}
      {...look}
      disabled={off}
    >
      {inner}
    </button>
  );
}

/**
 * Ref forwarding is required, not decorative: MUI Tooltip/Menu, Popper,
 * focus management and scroll-into-view all reach for the underlying node.
 * A button that swallows its ref silently breaks every one of them.
 */
export const Button = forwardRef(ButtonImpl);
Button.displayName = "Button";
