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
    // The canvas is light (see preview.css) but the vendored token defaults are
    // dark-first, so without a scheme attribute the buttons would render
    // near-white text on a near-white surface. Both attributes are set on
    // purpose: `data-mui-color-scheme` is what the Obsidian sheet itself keys
    // off, `data-theme` is this library's alias for hosts not running MUI —
    // setting both exercises the pair that ships.
    (Story) => (
      <div data-mui-color-scheme="light" data-theme="light">
        <Story />
      </div>
    ),
  ],
} satisfies Preview;

export default preview;
