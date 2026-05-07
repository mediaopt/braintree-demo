import type { Preview } from '@storybook/react-vite';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Introduction', 'Checkout', 'Playground'],
      },
    },
    docs: {
      toc: true,
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