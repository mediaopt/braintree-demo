import { useState } from "react";
import type {
  CartDraft,
  RoundingMode,
  TaxCalculationMode,
} from "@commercetools/platform-sdk";
import { createCart } from "../services/cart";
import {
  CART_CURRENCY,
  CART_COUNTRY,
  DEFAULT_CUSTOMER_ID,
  DISCOUNT_CODES, labelMap
} from "../../constants";
import { Button } from "./Button.tsx";
import { CheckoutLoader } from "../../CheckoutLoader/CheckoutLoader.tsx";
import type { BraintreeCheckoutMode, CartCheckoutData } from "../../types.ts";

interface LineItem {
  productId: string;
  quantity: number;
}

interface TriggerCheckoutButtonProps {
  mode: BraintreeCheckoutMode;
  products?: LineItem[];
  productId?: string;
  country?: string;
  signedIn?: boolean;
  applyDiscount?: boolean;
  priceRoundingMode?: RoundingMode;
  taxCalculationMode?: TaxCalculationMode;
}

export const TriggerCheckoutButton = ({
  mode,
  products,
  productId,
  country,
  signedIn,
  applyDiscount,
  priceRoundingMode,
  taxCalculationMode,
}: TriggerCheckoutButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CartCheckoutData | null>(
    null,
  );

  const handleClick = async () => {
    setLoading(true);
    try {
      const draft: CartDraft = {
        currency: CART_CURRENCY,
        country: CART_COUNTRY,
        ...(country && {
          billingAddress: { country },
          shippingAddress: { country },
        }),
        ...(signedIn && { customerId: DEFAULT_CUSTOMER_ID }),
        ...(applyDiscount && {
          discountCodes: DISCOUNT_CODES.map((d) => d.code),
        }),
        ...(priceRoundingMode && { priceRoundingMode }),
        ...(taxCalculationMode && { taxCalculationMode }),
        ...(productId
          ? { lineItems: [{ productId, quantity: 1 }] }
          : products?.length && {
              lineItems: products.map(({ productId: id, quantity }) => ({
                productId: id,
                quantity,
              })),
            }),
        ...(mode === "pureVault" && { customerId: DEFAULT_CUSTOMER_ID }),
      };

      const { body: newCart } = await createCart(draft);
      if (!newCart) return;

      setCheckoutData({
        cartId: newCart.id,
        currencyCode: newCart.totalPrice.currencyCode,
        countryCode:
          newCart.country ??
          newCart.billingAddress?.country ??
          newCart.shippingAddress?.country ??
          CART_COUNTRY,
        mode,
      });
    } finally {
      setLoading(false);
    }
  };

  return checkoutData ? (
    <></>
  ) : (
    <Button
      action={handleClick}
      title={loading ? "Loading…" : labelMap[mode]}
      disabled={loading}
    />
  );
};
