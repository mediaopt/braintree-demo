import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ["Introduction", "Checkout", "Modify Payment", "Playground"],
      },
    },
    docs: {
      toc: false, //in reasonable age storybook version the bug does not allow to turn TOC off for some stories, so it is off for all and manually added only if the story is long enough to require it
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;