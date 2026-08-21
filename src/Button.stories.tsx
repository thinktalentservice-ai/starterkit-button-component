import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, PRESETS } from "./index";
import type { ButtonFill, ButtonPreset, ButtonShape, ButtonSize, ButtonTone } from "./index";
import { Swatch } from "./stories/CodeSwatch";
import "./Button.stories.css";

const tones: ButtonTone[] = [
  "primary",
  "secondary",
  "accent",
  "success",
  "warning",
  "danger",
  "info",
  "accent-green",
  "accent-pink",
  "neutral",
];
const fills: ButtonFill[] = ["solid", "ghost", "outline", "bare"];
const sizes: ButtonSize[] = ["sm", "md", "lg"];
const shapes: ButtonShape[] = ["chip", "pill"];
const presets = Object.keys(PRESETS) as ButtonPreset[];

/* The two presets @devopsnext/starterkit-theme ships (its PRESET_IDS). Declared
   here rather than imported: .storybook/ is outside this project's tsconfig
   `include`, and the tone/fill/size lists above are local for the same reason.
   The ids must match the [data-brand="..."] scopes in brands.generated.css. */
const brands = [
  { id: "think", label: "Think" },
  { id: "elemetrik", label: "Elemetrik" },
] as const;

/* The pair worth putting side by side. `solid` carries --<tone>-on-solid, the
   one token that flips VALUE KIND between the two brands (Think reads its fill
   as light and lays #0b0f19 ink on it, Elemetrik reads its violet as dark and
   goes white) — so if brand tokens are not reaching the button, this row is
   where it shows without needing a colour picker. `outline` carries
   --<tone>-text, the chain tests/brand-regression.spec.ts guards. */
const comparisonFills: ButtonFill[] = ["solid", "outline"];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="ib-story-section">
      <div className="ib-story-section__header">
        <div>
          <h3 className="ib-story-section__title">{title}</h3>
        {description ? (
            <p className="ib-story-section__description">{description}</p>
        ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function StoryFrame({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="ib-story">
      <header className="ib-story__hero">
        <div>
          <p className="ib-story__eyebrow">IB / component specimen</p>
          <h2 className="ib-story__title">{title}</h2>
          <p className="ib-story__lede">{description}</p>
        </div>
        <div className="ib-story__axes" aria-label="Button design axes">
          <span>tone</span>
          <span>fill</span>
          <span>shape</span>
          <span>size</span>
        </div>
      </header>
      <div className="ib-story__body">{children}</div>
    </main>
  );
}

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A token-driven, polymorphic button with independent tone, fill, shape, and size axes. " +
          "Pass `href` to render an anchor; explicit axis props override named presets.\n\n" +
          "Every button below prints its own JSX underneath it — click the code to copy it. " +
          "The story-level **Show code** panel shows the surrounding loop, so the per-button " +
          "snippet is the one to copy.",
      },
    },
  },
  args: {
    children: "Deploy",
    size: "md",
    disabled: false,
    loading: false,
    fullWidth: false,
  },
  argTypes: {
    tone: {
      control: "select",
      options: tones,
      description: "Colour identity.",
    },
    fill: {
      control: "select",
      options: [...fills, "translucent"],
      description: "How the tone is applied to the surface.",
    },
    shape: {
      control: "inline-radio",
      options: shapes,
      description: "Corner geometry.",
    },
    size: {
      control: "inline-radio",
      options: sizes,
      description: "Padding, type scale, and minimum target size.",
    },
    variant: {
      control: "select",
      options: [undefined, ...presets],
      description: "Named preset. Explicit axis props take precedence.",
    },
    href: {
      control: "text",
      description: "When set, renders an anchor instead of a button.",
    },
    startIcon: {
      control: false,
    },
    endIcon: {
      control: false,
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({
    children,
    variant,
    tone,
    fill,
    shape,
    size,
    href,
    loading,
    disabled,
    fullWidth,
  }) => (
    <StoryFrame
      title="Button workbench"
      description="Tune the axes in Controls. The specimen and its paste-ready JSX update together."
    >
      <Section title="Live specimen" description="Click the dark code panel to copy this exact setup.">
        <div className="ib-story-grid">
          <Swatch
            variant={variant}
            tone={tone}
            fill={fill}
            shape={shape}
            size={size}
            href={href}
            loading={loading}
            disabled={disabled}
            fullWidth={fullWidth}
          >
            {typeof children === "string" ? children : "Deploy"}
          </Swatch>
        </div>
      </Section>
    </StoryFrame>
  ),
};

export const Presets: Story = {
  render: () => (
    <StoryFrame
      title="Preset index"
      description="Named shortcuts for common points in the same four-axis system—useful defaults, never a separate styling API."
    >
      <Section
        title="Named presets"
        description="Convenience aliases only—each resolves to the same orthogonal axes shown in Controls."
      >
        <div className="ib-story-grid">
          {presets.map((variant) => (
            <Swatch key={variant} variant={variant}>
              {variant}
            </Swatch>
          ))}
        </div>
      </Section>
    </StoryFrame>
  ),
};

export const AxisMatrix: Story = {
  render: () => (
    <StoryFrame
      title="Tone × fill atlas"
      description="Scan the full visual system by surface treatment. Each specimen exposes the exact JSX responsible for it."
    >
      {fills.map((fill) => (
        <Section key={fill} title={fill}>
          <div className="ib-story-grid">
            {tones.map((tone) => (
              <Swatch key={tone} tone={tone} fill={fill}>
                {tone}
              </Swatch>
            ))}
          </div>
        </Section>
      ))}
    </StoryFrame>
  ),
};

export const SizesAndShapes: Story = {
  render: () => (
    <StoryFrame
      title="Geometry scale"
      description="Compare target size and silhouette without changing the button’s color identity."
    >
      {shapes.map((shape) => (
        <Section key={shape} title={shape}>
          <div className="ib-story-grid">
            {sizes.map((size) => (
              <Swatch key={size} shape={shape} size={size} tone="primary">
                {size}
              </Swatch>
            ))}
          </div>
        </Section>
      ))}
    </StoryFrame>
  ),
};

export const States: Story = {
  render: () => (
    <StoryFrame
      title="Behavior states"
      description="Operational states, links, and width behavior shown as real interactive elements—not static approximations."
    >
      <Section title="Interaction states">
        <div className="ib-story-grid">
          <Swatch tone="primary">Ready</Swatch>
          <Swatch tone="secondary" loading>
            Saving
          </Swatch>
          <Swatch tone="danger" disabled>
            Disabled
          </Swatch>
          <Swatch href="#button-link" tone="primary" fill="outline">
            Anchor
          </Swatch>
          <Swatch href="#disabled-link" tone="warning" fill="bare" disabled>
            Disabled anchor
          </Swatch>
        </div>
      </Section>
      <Section title="Width">
        <Swatch fullWidth tone="primary">
          Full-width action
        </Swatch>
      </Section>
    </StoryFrame>
  ),
};

export const ContextualTranslucent: Story = {
  render: () => (
    <StoryFrame
      title="Context surfaces"
      description="The translucent fill is tested where it belongs: over an expressive, high-contrast feature surface."
    >
      <div className="ib-story-context">
        <Section
          title="Translucent on a coloured surface"
          description="This fill is intentionally white-on-whatever and belongs on heroes or featured cards."
        >
          <div className="ib-story-grid">
            <Swatch fill="translucent" inverse>
              Explore
            </Swatch>
            <Swatch fill="translucent" shape="pill" inverse>
              View details
            </Swatch>
            <Swatch fill="translucent" loading inverse>
              Loading
            </Swatch>
          </div>
        </Section>
      </div>
    </StoryFrame>
  ),
};

export const BrandComparison: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Both brand presets at once, at whichever scheme the toolbar is set to. " +
          "The Brand toggle switches the rest of the workshop; this story is the one " +
          "place you can see the delta without flipping back and forth.",
      },
    },
  },
  /* Plain <Button> rather than <Swatch> here, deliberately: a Swatch prints the
     JSX that produced it, and the JSX for these specimens is identical across
     both columns — the whole difference lives in the wrapper's data-brand. A
     copyable snippet that omits the only thing being demonstrated would be
     worse than no snippet. Every other story keeps its Swatches. */
  render: (_args, { globals }) => {
    const scheme = globals.scheme === "dark" ? "dark" : "light";

    return (
      <StoryFrame
        title="Brand comparison"
        description="The same buttons under both starterkit-theme presets, side by side at the current scheme."
      >
        <Section
          title={`Think vs Elemetrik — ${scheme} scheme`}
          description="Watch the solid row: its label ink is dark under Think and white under Elemetrik, because --<tone>-on-solid is measured per brand rather than assumed."
        >
          <div className="ib-story-brands">
            {brands.map(({ id, label }) => (
              /* Both attributes on THIS element, not split with an ancestor:
                 brands.generated.css scopes each preset's light block as
                 [data-brand="x"][data-mui-color-scheme="light"], a compound
                 selector. A wrapper carrying only data-brand would inherit
                 <html>'s light scheme yet match the brand's dark block, and
                 the column would quietly render dark tokens on a light page. */
              <div
                key={id}
                className="ib-story-brand"
                data-brand={id}
                data-mui-color-scheme={scheme}
                data-theme={scheme}
              >
                <p className="ib-story-brand__label">
                  <span className="ib-story-brand__dot" />
                  {label}
                </p>
                {comparisonFills.map((fill) => (
                  <div key={fill} className="ib-story-brand__row">
                    <span className="ib-story-brand__fill">{fill}</span>
                    <div className="ib-story-grid">
                      {tones.map((tone) => (
                        <Button key={tone} tone={tone} fill={fill}>
                          {tone}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Section>
      </StoryFrame>
    );
  },
};

/* starterkit-theme 1.1.1 added two DUO-TONE gradients spanning two roles —
   --gradient-primary-info and --gradient-primary-accent-pink — alongside its
   new info/accent-green/accent-pink roles. A `--gradient-{family}` (what
   .ib-btn's `tone` axis publishes as --ib-grad) is always drawn from ONE
   family's own --solid / --solid-hover, so these two have no tone to render
   through; they are painted straight from the token here for discoverability,
   each with a Think-valued fallback matching the sheet's own default. */
const crossFamilyGradients = [
  {
    token: "--gradient-primary-info",
    ink: "--gradient-primary-info-ink",
    fallback: "linear-gradient(135deg, var(--primary-solid, #0099ff), var(--info-solid, #0078d4))",
    label: "Primary → Info",
  },
  {
    token: "--gradient-primary-accent-pink",
    ink: "--gradient-primary-accent-pink-ink",
    fallback: "linear-gradient(135deg, var(--primary-solid, #0099ff), var(--accent-pink-solid, #ee4480))",
    label: "Primary → Accent Pink",
  },
] as const;

export const CrossFamilyGradients: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Two new duo-tone gradients from starterkit-theme 1.1.1, spanning two roles rather than one " +
          "family's own solid/hover pair. The button's `tone` axis has no slot for a two-role gradient, so " +
          "these are shown directly from their tokens rather than through a Swatch.",
      },
    },
  },
  render: () => (
    <StoryFrame
      title="Cross-family gradients"
      description="New in starterkit-theme 1.1.1 — --gradient-primary-info and --gradient-primary-accent-pink, each with its own measured ink token."
    >
      <Section
        title="Duo-tone tokens"
        description="Painted straight from the token (a Think-valued fallback applies where the host sheet is absent) — not reachable through tone."
      >
        <div className="ib-story-gradient-grid">
          {crossFamilyGradients.map(({ token, ink, fallback, label }) => (
            <div
              key={token}
              className="ib-story-gradient"
              style={{
                background: `var(${token}, ${fallback})`,
                color: `var(${ink}, #0b0f19)`,
              }}
            >
              <span>{label}</span>
              <code>{token}</code>
            </div>
          ))}
        </div>
      </Section>
    </StoryFrame>
  ),
};
