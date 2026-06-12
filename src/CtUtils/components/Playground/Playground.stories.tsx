import type { Meta, StoryObj } from "@storybook/react";
import { Playground } from "./Playground";
import { labelMap } from "../../../constants.ts";
import { CartProvider } from "../../context/CartContext.tsx";

const meta = {
  title: "Playground",
  component: Playground,
  decorators: [(Story) => <CartProvider><Story /></CartProvider>],
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
