import { useLayoutEffect } from "react";
import type { Preview } from "@storybook/react-vite";
import "../styles.css";
import "./preview.css";

const preview = {
  parameters: {
    layout: "fullscreen",
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
  // Declared without a `toolbar` block on purpose: the control for this global
  // is the one-click button registered in `.storybook/manager.tsx`. A dropdown
  // AND a button for a two-value axis is two ways to say the same thing, and
  // the one that disagrees with the canvas is the one nobody notices. The
  // global itself stays declared so `?globals=scheme:dark` keeps working as a
  // shareable link.
  globalTypes: {
    scheme: {
      description: "Colour scheme the buttons render against",
    },
  },
  // Light, matching the sibling component workshops — a reader moving between
  // the card's docs and this one should not be handed a different-looking site.
  // The vendored token defaults are dark-first, so Dark is the other half of the
  // toolbar rather than an afterthought; only the workshop's resting state is
  // light.
  initialGlobals: { scheme: "light" },
  decorators: [
    // Both attributes are set on purpose: `data-mui-color-scheme` is what the
    // Obsidian sheet itself keys off, `data-theme` is this library's alias for
    // hosts not running MUI — setting both exercises the pair that ships.
    //
    // They also go on <html>, and that placement is load-bearing rather than
    // belt-and-braces. styles.css carries a `prefers-color-scheme: light`
    // fallback guarded by `:root:not([data-mui-color-scheme]):not([data-theme])`
    // for hosts that declare no scheme at all. With the attributes only on this
    // wrapper div, <html> still has neither — so on a machine whose OS
    // preference is light, that block would match and paint light tokens onto
    // every .ib-btn in DARK mode. Writing them to the root makes the guard fail,
    // which is the whole point of the guard.
    //
    // `data-scheme` is separate and workshop-only: preview.css keys the canvas
    // and the docs-block background off it.
    (Story, context) => {
      const scheme = context.globals.scheme === "dark" ? "dark" : "light";

      useLayoutEffect(() => {
        const root = document.documentElement;
        root.dataset.scheme = scheme;
        root.dataset.theme = scheme;
        root.dataset.muiColorScheme = scheme;
      }, [scheme]);

      return (
        <div data-mui-color-scheme={scheme} data-theme={scheme}>
          <Story />
        </div>
      );
    },
  ],
} satisfies Preview;

export default preview;
