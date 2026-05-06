import type { Meta, StoryObj } from "@storybook/react";
import { CartWrapper } from "./CartWrapper";

const meta = {
  title: "Playground",
  component: CartWrapper,
  args: {},
} satisfies Meta<typeof CartWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkout: Story = {
  args: {
    mode: "standard",
  },
};
