import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { Button } from "./Button";
import { PRESETS, resolveAxes } from "./axes";

/**
 * These tests assert BEHAVIOUR and the DOM contract the CSS selects on — not
 * appearance. Appearance lives in styles.css and is verified visually.
 *
 * The DOM contract is worth pinning: rename `data-fill` here and every rule in
 * styles.css silently stops matching, producing an unstyled button that no type
 * checker would catch.
 */

const attrs = (el: HTMLElement) => ({
  tone: el.getAttribute("data-tone"),
  fill: el.getAttribute("data-fill"),
  shape: el.getAttribute("data-shape"),
  size: el.getAttribute("data-size"),
});

describe("axis resolution", () => {
  it("defaults to primary / solid / chip / md", () => {
    render(<Button>Go</Button>);
    expect(attrs(screen.getByRole("button"))).toEqual({
      tone: "primary",
      fill: "solid",
      shape: "chip",
      size: "md",
    });
  });

  it("maps every preset onto axes without styling anything itself", () => {
    for (const name of Object.keys(PRESETS) as Array<keyof typeof PRESETS>) {
      const { unmount } = render(<Button variant={name}>{name}</Button>);
      const resolved = resolveAxes({}, name);
      expect(attrs(screen.getByRole("button"))).toEqual({ ...resolved, size: "md" });
      unmount();
    }
  });

  it("produces identical axes for a preset and its explicit equivalent", () => {
    const { container: viaPreset } = render(<Button variant="pill">Docs</Button>);
    const { container: viaAxes } = render(
      <Button tone="primary" fill="outline" shape="pill">
        Docs
      </Button>,
    );
    expect(attrs(viaPreset.firstElementChild as HTMLElement)).toEqual(
      attrs(viaAxes.firstElementChild as HTMLElement),
    );
  });

  it("lets an explicit axis override the preset", () => {
    render(
      <Button variant="pill" tone="danger">
        Delete
      </Button>,
    );
    // tone overridden, fill + shape still inherited from the preset
    expect(attrs(screen.getByRole("button"))).toMatchObject({
      tone: "danger",
      fill: "outline",
      shape: "pill",
    });
  });

  it("degrades an unknown preset to the defaults instead of rendering unstyled", () => {
    // Reachable from plain JS consumers, where the union type is not enforced.
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Button variant={"nope" as never}>Go</Button>);
    expect(attrs(screen.getByRole("button"))).toMatchObject({ tone: "primary", fill: "solid" });
    // Silent degradation would hide a typo forever; prop-types used to catch it.
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Unknown variant "nope"'));
    warn.mockRestore();
  });

  it("does not warn for a valid preset — presets are supported API, not deprecated", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Button variant="pill-filled">Go</Button>);
    render(<Button variant="ghost">Go</Button>);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("keeps the ib-btn class when a caller passes className", () => {
    render(<Button className="mt-4">Go</Button>);
    const el = screen.getByRole("button");
    expect(el).toHaveClass("ib-btn");
    expect(el).toHaveClass("mt-4");
  });

  it("flags fullWidth as a data attribute rather than an inline style", () => {
    render(<Button fullWidth>Go</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-full-width");
    expect(screen.getByRole("button").getAttribute("style")).toBeNull();
  });
});

describe("interactive state", () => {
  it("marks a pressable button data-interactive so CSS can gate hover", () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-interactive");
  });

  it("drops data-interactive when disabled or loading", () => {
    const { unmount } = render(<Button disabled>Go</Button>);
    expect(screen.getByRole("button")).not.toHaveAttribute("data-interactive");
    unmount();
    render(<Button loading>Go</Button>);
    expect(screen.getByRole("button")).not.toHaveAttribute("data-interactive");
  });
});

describe("disabled", () => {
  it("blocks clicks", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Go
      </Button>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

describe("loading", () => {
  it("announces busy, blocks clicks, and swaps the start icon for the spinner", () => {
    const onClick = vi.fn();
    render(
      <Button loading startIcon={<span data-testid="start" />} endIcon={<span data-testid="end" />} onClick={onClick}>
        Saving
      </Button>,
    );
    const el = screen.getByRole("button");
    fireEvent.click(el);

    expect(onClick).not.toHaveBeenCalled();
    expect(el).toHaveAttribute("aria-busy", "true");
    expect(el).toHaveAttribute("data-loading");
    expect(el).toBeDisabled();
    expect(el.querySelector(".ib-btn__spinner")).not.toBeNull();
    expect(screen.queryByTestId("start")).toBeNull();
    expect(screen.queryByTestId("end")).toBeNull();
  });

  it("hides the spinner from assistive tech (aria-busy already carries the state)", () => {
    render(<Button loading>Saving</Button>);
    expect(screen.getByRole("button").querySelector(".ib-btn__spinner")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("does not set aria-busy when idle", () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy");
  });
});

describe("anchor mode", () => {
  it("renders an anchor with the href and passes anchor-only attributes through", () => {
    render(
      <Button href="/docs" target="_blank" rel="noreferrer">
        Docs
      </Button>,
    );
    const el = screen.getByRole("link");
    expect(el.tagName).toBe("A");
    expect(el).toHaveAttribute("href", "/docs");
    expect(el).toHaveAttribute("target", "_blank");
  });

  // An <a> ignores the disabled attribute entirely. This is the riskiest code in
  // the component: get it wrong and a "disabled" link still navigates.
  it("makes a disabled link inert: no href, out of tab order, aria-disabled", () => {
    render(
      <Button href="/docs" disabled>
        Docs
      </Button>,
    );
    const el = screen.getByRole("link");
    expect(el).not.toHaveAttribute("href");
    expect(el).toHaveAttribute("aria-disabled", "true");
    expect(el).toHaveAttribute("tabindex", "-1");
  });

  it("detaches onClick from a disabled link so it cannot fire programmatically", () => {
    const onClick = vi.fn();
    render(
      <Button href="/docs" disabled onClick={onClick}>
        Docs
      </Button>,
    );
    fireEvent.click(screen.getByRole("link"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("ignores a caller tabIndex that would resurrect a disabled link", () => {
    render(
      <Button href="/docs" disabled tabIndex={0}>
        Docs
      </Button>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("tabindex", "-1");
  });

  it("keeps a loading link inert too", () => {
    render(
      <Button href="/docs" loading>
        Docs
      </Button>,
    );
    const el = screen.getByRole("link");
    expect(el).not.toHaveAttribute("href");
    expect(el).toHaveAttribute("aria-busy", "true");
  });
});

describe("ref forwarding", () => {
  it("forwards to the underlying button node", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Go</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("forwards to the underlying anchor node", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Button ref={ref} href="/docs">
        Docs
      </Button>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});

describe("accessibility", () => {
  /**
   * jsdom performs no layout, so axe's colour-contrast rule cannot run here and
   * is disabled explicitly rather than silently skipped — contrast is verified
   * against the real rendered page, not in this file. What this does catch is
   * role/name/aria-state breakage across the whole axis matrix.
   */
  it("reports no axe violations across the axis matrix", async () => {
    const tones = [
      "primary",
      "secondary",
      "accent",
      "success",
      "warning",
      "danger",
      "neutral",
    ] as const;
    const fills = ["solid", "ghost", "outline", "bare", "translucent"] as const;

    const { container } = render(
      <div>
        {tones.map((tone) =>
          fills.map((fill) => (
            <Button key={`${tone}-${fill}`} tone={tone} fill={fill}>
              {tone} {fill}
            </Button>
          )),
        )}
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
        <Button href="/docs">Link</Button>
        <Button href="/docs" disabled>
          Disabled link
        </Button>
      </div>,
    );

    const results = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(results.violations).toEqual([]);
  }, 20000);
});
