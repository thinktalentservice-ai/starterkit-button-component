import { fireEvent, render, screen } from "@testing-library/react";
import { Swatch, formatButtonSnippet } from "./CodeSwatch";

/**
 * The snippet is the docs' source of truth for "how do I write this button", so
 * it is generated from the same props object the Button receives — never typed
 * out by hand. These tests pin that generation: a swatch whose printed code
 * disagrees with the rendered button is worse than no code at all.
 */

describe("formatButtonSnippet", () => {
  it("prints a bare Button when no axes are set", () => {
    expect(formatButtonSnippet({ children: "Deploy" })).toBe("<Button>Deploy</Button>");
  });

  it("emits props in a stable order, not insertion order", () => {
    expect(formatButtonSnippet({ fill: "ghost", tone: "primary", children: "primary" })).toBe(
      '<Button tone="primary" fill="ghost">primary</Button>',
    );
  });

  it("writes true booleans bare and drops false ones", () => {
    expect(
      formatButtonSnippet({ tone: "danger", disabled: true, loading: false, children: "Disabled" }),
    ).toBe('<Button tone="danger" disabled>Disabled</Button>');
  });

  it("keeps href with the other string props", () => {
    expect(
      formatButtonSnippet({ href: "#link", tone: "primary", fill: "outline", children: "Anchor" }),
    ).toBe('<Button tone="primary" fill="outline" href="#link">Anchor</Button>');
  });

  it("prints preset, shape and size", () => {
    expect(
      formatButtonSnippet({ variant: "pill", shape: "pill", size: "lg", children: "lg" }),
    ).toBe('<Button variant="pill" shape="pill" size="lg">lg</Button>');
  });
});

describe("Swatch", () => {
  it("renders the real Button for the props it prints", () => {
    render(
      <Swatch tone="secondary" fill="outline" shape="pill" size="sm">
        secondary
      </Swatch>,
    );
    const button = screen.getByRole("button", { name: "secondary" });
    expect(button.getAttribute("data-tone")).toBe("secondary");
    expect(button.getAttribute("data-fill")).toBe("outline");
    expect(button.getAttribute("data-shape")).toBe("pill");
    expect(button.getAttribute("data-size")).toBe("sm");
    expect(
      screen.getByText('<Button tone="secondary" fill="outline" shape="pill" size="sm">secondary</Button>'),
    ).toBeInTheDocument();
  });

  it("renders an anchor when href is set", () => {
    render(
      <Swatch href="#somewhere" tone="primary">
        Anchor
      </Swatch>,
    );
    expect(screen.getByRole("link", { name: "Anchor" })).toHaveAttribute("href", "#somewhere");
  });

  it("copies its snippet and acknowledges the copy", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<Swatch tone="warning">Ship</Swatch>);
    fireEvent.click(screen.getByRole("button", { name: /copy/i }));

    expect(writeText).toHaveBeenCalledWith('<Button tone="warning">Ship</Button>');
    expect(await screen.findByText(/^Copied$/)).toBeInTheDocument();
  });
});
