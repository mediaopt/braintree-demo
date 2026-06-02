import type { Meta, StoryObj } from "@storybook/react";
import { Playground } from "./Playground";

const meta = {
  title: "Playground",
  component: Playground,
  args: {},
  argTypes: {
    mode: {
      options: Object.keys(labelMap),
      control: {
        type: "radio",
        labels: labelMap,
      },
    },
  },
} satisfies Meta<typeof Playground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mode: "fullCheckout",
  },
};
