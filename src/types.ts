import type { ShippingMethodResourceIdentifier, Cart } from "@commercetools/platform-sdk";

export type CartCheckoutData = {
  cartId: string;
  currencyCode: string;
  countryCode: string;
  mode: BraintreeCheckoutMode;
  productId?: string;
};

export type BraintreeCheckoutMode =
  | "fullCheckout"
  | "paymentOnly"
  | "express"
  | "pureVault";

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type CartStateData = Mutable<
  Partial<
    Pick<
      Cart,
      | "country"
      | "taxMode"
      | "priceRoundingMode"
      | "taxRoundingMode"
      | "taxCalculationMode"
      | "inventoryMode"
      | "customerId"
      | "customerEmail"
      | "billingAddress"
      | "shippingAddress"
    >
  >
> & {
  shippingMethod?: ShippingMethodResourceIdentifier;
  discountCodes?: string[];
};

export type OnLocalCartUpdate = (partial: Partial<CartStateData>) => void;
