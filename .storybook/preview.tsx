import type { Preview } from "@storybook/react-vite";
import "../styles.css";
import "./preview.css";

const preview = {
  parameters: {
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    options: {
      storySort: {
        order: ["Components", ["Button"]],
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div data-theme="light">
        <Story />
      </div>
    ),
  ],
} satisfies Preview;

export default preview;
