import type { Meta, StoryObj } from "@storybook/react";
import type { FC } from "react";
import { TriggerCheckoutButton } from "./TriggerCheckoutButton";
import { PRODUCTS } from "./Playground/ProductsGroup";

const meta = {
  title: "Checkout",
  component: TriggerCheckoutButton,
  args: {},
  argTypes: {
    mode: { table: { disable: true } },
    products: { table: { disable: true } },
  },
} satisfies Meta<typeof TriggerCheckoutButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Standard story wrapper ---

type QuantityKey = (typeof PRODUCTS)[number]["description"];

type CartSettingsArgs = {
  country?: string;
  signedIn?: boolean;
  applyDiscount?: boolean;
  priceRoundingMode?: string;
  taxCalculationMode?: string;
};

interface StandardWrapperProps extends CartSettingsArgs {
  quantities: Record<QuantityKey, number>;
}

const StandardWrapper: FC<StandardWrapperProps> = ({
  quantities,
  country,
  signedIn,
  applyDiscount,
  priceRoundingMode,
  taxCalculationMode,
}) => {
  const products = PRODUCTS
    .map((p) => ({ productId: p.id, quantity: quantities[p.description] }))
    .filter((p) => p.quantity > 0);

  return (
    <TriggerCheckoutButton
      mode="standard"
      products={products}
      country={country}
      signedIn={signedIn}
      applyDiscount={applyDiscount}
      priceRoundingMode={priceRoundingMode}
      taxCalculationMode={taxCalculationMode}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CART_SETTINGS_ARG_TYPES: any = {
  country: {
    control: "select",
    options: ["Germany", "USA"],
    mapping: { Germany: "DE", USA: "US" },
    table: { category: "Cart settings" },
  },
  signedIn: { control: "boolean", table: { category: "Cart settings" } },
  applyDiscount: { control: "boolean", table: { category: "Cart settings" } },
  priceRoundingMode: {
    control: "select",
    options: ["HalfEven", "HalfUp", "HalfDown"],
    table: { category: "Cart settings" },
  },
  taxCalculationMode: {
    control: "select",
    options: ["LineItemLevel", "UnitPriceLevel"],
    table: { category: "Cart settings" },
  },
};

const CART_SETTINGS_ARGS = {
  country: "Germany",
  signedIn: false,
  applyDiscount: false,
  priceRoundingMode: "HalfEven",
  taxCalculationMode: "LineItemLevel",
};

// --- Stories ---

export const PureVault: Story = {
  parameters: { controls: { disable: true } },
  args: {
    mode: "pureVault",
    products: [],
  },
};

export const Express: Story = {
  argTypes: {
    productId: {
      control: "select",
      options: PRODUCTS.map((p) => p.description),
      mapping: Object.fromEntries(PRODUCTS.map((p) => [p.description, p.id])),
    },
    label: { table: { disable: true } },
    ...CART_SETTINGS_ARG_TYPES,
  },
  args: {
    mode: "express",
    productId: PRODUCTS[0].description,
    ...CART_SETTINGS_ARGS,
  },
};

export const Standard: Story = {
  render: (args) => {
    const a = args as any;
    const quantities = Object.fromEntries(
      PRODUCTS.map((p) => [p.description, a[p.description] ?? 0])
    ) as Record<QuantityKey, number>;
    return (
      <StandardWrapper
        quantities={quantities}
        country={a.country}
        signedIn={a.signedIn}
        applyDiscount={a.applyDiscount}
        priceRoundingMode={a.priceRoundingMode}
        taxCalculationMode={a.taxCalculationMode}
      />
    );
  },
  argTypes: {
    productId: { table: { disable: true } },
    ...Object.fromEntries(
      PRODUCTS.map((p) => [p.description, { control: { type: "number", min: 0 }, table: { category: "Products" } }])
    ),
    ...CART_SETTINGS_ARG_TYPES,
  } as any,
  args: {
    mode: "standard",
    ...Object.fromEntries(PRODUCTS.map((p, i) => [p.description, i === 0 ? 1 : 0])),
    ...CART_SETTINGS_ARGS,
  } as any,
};
