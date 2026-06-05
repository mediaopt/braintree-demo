import type { Meta, StoryObj } from "@storybook/react";
import { Return } from "./Return";

const meta = {
  title: "Return",
  component: Return,
  tags: ["!dev"],
} satisfies Meta<typeof Return>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
