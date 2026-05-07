import type { Meta, StoryObj } from "@storybook/react";
import { Playground } from "./Playground";

const meta = {
  title: "Playground",
  component: Playground,
  args: {},
  argTypes: {
    mode: {
      options: ["standard", "express", "pureVault"],
      control: {
        type: "radio",
        labels: {
          standard: "Standard",
          express: "Buy now",
          pureVault: "Vault without purchase",
        },
      },
    },
  },
} satisfies Meta<typeof Playground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkout: Story = {
  args: {
    mode: "standard",
  },
};
