import type { CartDraft } from "@commercetools/platform-sdk";
import type { CartStateData } from "./types.ts";
import { ADDRESSES, CART_COUNTRY, CART_CURRENCY } from "./constants.ts";

export const cartDraftFromLocal = (localDraft?: CartStateData): CartDraft => {
  const country = localDraft?.country ?? CART_COUNTRY;
  const currency = localDraft?.currency ?? CART_CURRENCY;
  const address = ADDRESSES[country];
  return {
    ...(localDraft ?? []),
    country,
    currency,
    billingAddress: address,
    shippingAddress: address,
    customerEmail: "guest@checkout.ct",
  };
};
