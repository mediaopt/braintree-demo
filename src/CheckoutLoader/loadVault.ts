import { buildPaymentTemplateData } from "./session.ts";
import { mountExpressMethods } from "./mountExpressMethods.ts";
import { cartDraftFromLocal } from "../helpers.ts";
import type { CartStateData } from "../types.ts";

export const loadVault = async (
  cartId: string,
  localDraft?: CartStateData,
): Promise<void> => {
  const paymentData = await buildPaymentTemplateData(cartId);
  const draft = cartDraftFromLocal(localDraft);
  await mountExpressMethods(paymentData, {
    countryCode: draft.country!, // always set by cartDraftFromLocal (falls back to CART_COUNTRY)
    currencyCode: draft.currency!, // always set by cartDraftFromLocal (falls back to CART_CURRENCY)
    filter: (type) => type !== "PayPal",
    onPayButtonClick: async () => {},
  });
};
