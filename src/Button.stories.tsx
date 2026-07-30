import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, PRESETS } from "./index";
import type { ButtonFill, ButtonPreset, ButtonShape, ButtonSize, ButtonTone } from "./index";

const tones: ButtonTone[] = ["mint", "violet", "amber", "danger", "blue", "neutral"];
const fills: ButtonFill[] = ["solid", "ghost", "outline", "bare"];
const sizes: ButtonSize[] = ["sm", "md", "lg"];
const shapes: ButtonShape[] = ["chip", "pill"];
const presets = Object.keys(PRESETS) as ButtonPreset[];

const gridStyle: CSSProperties = {
  display: "grid",
  gap: "1.5rem",
  minWidth: "min(880px, 82vw)",
};

const rowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.75rem",
};

function Section({
  title,
  description,
  inverse = false,
  children,
}: {
  title: string;
  description?: string;
  inverse?: boolean;
  children: ReactNode;
}) {
  return (
    <section style={{ display: "grid", gap: "0.65rem" }}>
      <div>
        <h3 style={{ margin: 0, color: inverse ? "#fff" : "#15182a", fontSize: "0.95rem" }}>
          {title}
        </h3>
        {description ? (
          <p
            style={{
              margin: "0.25rem 0 0",
              color: inverse ? "rgb(255 255 255 / 0.72)" : "#626984",
              fontSize: "0.8rem",
            }}
          >
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A token-driven, polymorphic button with independent tone, fill, shape, and size axes. " +
          "Pass `href` to render an anchor; explicit axis props override named presets.",
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

export const Playground: Story = {};

export const Presets: Story = {
  render: () => (
    <div style={gridStyle}>
      <Section
        title="Named presets"
        description="Convenience aliases only—each resolves to the same orthogonal axes shown in Controls."
      >
        <div style={rowStyle}>
          {presets.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
      </Section>
    </div>
  ),
};

export const AxisMatrix: Story = {
  render: () => (
    <div style={gridStyle}>
      {fills.map((fill) => (
        <Section key={fill} title={fill}>
          <div style={rowStyle}>
            {tones.map((tone) => (
              <Button key={tone} tone={tone} fill={fill}>
                {tone}
              </Button>
            ))}
          </div>
        </Section>
      ))}
    </div>
  ),
};

export const SizesAndShapes: Story = {
  render: () => (
    <div style={gridStyle}>
      {shapes.map((shape) => (
        <Section key={shape} title={shape}>
          <div style={rowStyle}>
            {sizes.map((size) => (
              <Button key={size} shape={shape} size={size} tone="blue">
                {size}
              </Button>
            ))}
          </div>
        </Section>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={gridStyle}>
      <Section title="Interaction states">
        <div style={rowStyle}>
          <Button tone="mint">Ready</Button>
          <Button tone="violet" loading>
            Saving
          </Button>
          <Button tone="danger" disabled>
            Disabled
          </Button>
          <Button href="#button-link" tone="blue" fill="outline">
            Anchor
          </Button>
          <Button href="#disabled-link" tone="amber" fill="bare" disabled>
            Disabled anchor
          </Button>
        </div>
      </Section>
      <Section title="Width">
        <Button fullWidth tone="blue">
          Full-width action
        </Button>
      </Section>
    </div>
  ),
};

export const ContextualTranslucent: Story = {
  render: () => (
    <div
      style={{
        minWidth: "min(720px, 80vw)",
        padding: "3rem",
        borderRadius: "1.5rem",
        background:
          "radial-gradient(circle at 15% 0%, rgb(179 211 53 / 0.28), transparent 45%), " +
          "linear-gradient(135deg, #171a31, #41306f 55%, #006acc)",
        boxShadow: "0 30px 80px rgb(20 18 40 / 0.28)",
      }}
    >
      <Section
        title="Translucent on a coloured surface"
        description="This fill is intentionally white-on-whatever and belongs on heroes or featured cards."
        inverse
      >
        <div style={rowStyle}>
          <Button fill="translucent">Explore</Button>
          <Button fill="translucent" shape="pill">
            View details
          </Button>
          <Button fill="translucent" loading>
            Loading
          </Button>
        </div>
      </Section>
    </div>
  ),
};
