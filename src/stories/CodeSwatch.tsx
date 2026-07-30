import { useEffect, useRef, useState } from "react";
import { Button } from "../Button";
import type { ButtonFill, ButtonPreset, ButtonShape, ButtonSize, ButtonTone } from "../axes";
import "./CodeSwatch.css";

/**
 * Storybook's "Show code" panel shows the SOURCE OF THE STORY, so a matrix
 * story that maps over the axes documents the loop — not the button. A reader
 * looking at the third chip in the second row still has to count rows to work
 * out which `fill` produced it.
 *
 * A Swatch fixes that by printing each button's own JSX underneath it. The
 * snippet is derived from the very props object that is spread onto `Button`,
 * so the two cannot drift: change the swatch and the code changes with it.
 *
 * This file is story-only scaffolding. `package.json#files` ships `dist` alone
 * and tsup builds from `src/index.ts`, so nothing here reaches consumers.
 */

export interface SwatchProps {
  variant?: ButtonPreset;
  tone?: ButtonTone;
  fill?: ButtonFill;
  shape?: ButtonShape;
  size?: ButtonSize;
  href?: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Restricted to a string so the printed snippet is always the literal JSX. */
  children: string;
}

// Printed in this order regardless of how the swatch was written, so two
// swatches with the same axes always produce a byte-identical snippet.
const STRING_PROPS = ["variant", "tone", "fill", "shape", "size", "href"] as const;
const BOOLEAN_PROPS = ["loading", "disabled", "fullWidth"] as const;

export function formatButtonSnippet(props: SwatchProps): string {
  const parts: string[] = [];

  for (const key of STRING_PROPS) {
    const value = props[key];
    if (value !== undefined) parts.push(`${key}="${value}"`);
  }
  // `loading={false}` is noise in a snippet meant to be pasted — a JSX boolean
  // is only worth printing when it is on, and then only as a bare attribute.
  for (const key of BOOLEAN_PROPS) {
    if (props[key]) parts.push(key);
  }

  const attrs = parts.length > 0 ? ` ${parts.join(" ")}` : "";
  return `<Button${attrs}>${props.children}</Button>`;
}

/** Non-secure contexts (plain-http Storybook on a LAN host) have no async clipboard. */
function copyFallback(text: string): void {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  document.body.removeChild(area);
}

/**
 * One button plus the exact JSX that produced it. Click the code to copy it.
 */
export function Swatch({ inverse = false, ...props }: SwatchProps & { inverse?: boolean }) {
  const code = formatButtonSnippet(props);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Without this, unmounting a swatch mid-flash (docs re-render on every args
  // change) leaves a timeout writing state into a dead component.
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      copyFallback(code);
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1200);
  };

  const { children, href, ...axes } = props;

  return (
    <article
      className="ib-specimen"
      data-inverse={inverse || undefined}
      data-wide={props.fullWidth || undefined}
    >
      <div className="ib-specimen__stage">
        {href !== undefined ? (
          <Button href={href} {...axes}>
            {children}
          </Button>
        ) : (
          <Button {...axes}>{children}</Button>
        )}
      </div>
      <button
        type="button"
        onClick={copy}
        className="ib-specimen__code"
        data-copied={copied || undefined}
        aria-label={`Copy code: ${code}`}
      >
        <span className="ib-specimen__code-meta" aria-hidden="true">
          <span>JSX</span>
          <span className="ib-specimen__copy-state">
            {copied ? (
              <>
                <CheckIcon />
                Copied
              </>
            ) : (
              <>
                <CopyIcon />
                Copy
              </>
            )}
          </span>
        </span>
        <code>{code}</code>
        <span className="ib-visually-hidden" aria-live="polite">
          {copied ? "Code copied to clipboard" : ""}
        </span>
      </button>
    </article>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="5.25" y="5.25" width="7.5" height="7.5" rx="1.5" />
      <path d="M10.75 5.25V4A1.75 1.75 0 0 0 9 2.25H4A1.75 1.75 0 0 0 2.25 4v5A1.75 1.75 0 0 0 4 10.75h1.25" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m3 8.25 3.1 3.1L13 4.65" />
    </svg>
  );
}
