import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  "framework": "@storybook/react-vite",
  staticDirs: ['../public'],
  viteFinal: (config) => {
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    config.base = process.env.VITE_BASE_PATH ?? '/';
    return config;
  },
};
export default config;