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
  "neutral",
];
const fills: ButtonFill[] = ["solid", "ghost", "outline", "bare"];
const sizes: ButtonSize[] = ["sm", "md", "lg"];
const shapes: ButtonShape[] = ["chip", "pill"];
const presets = Object.keys(PRESETS) as ButtonPreset[];

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
