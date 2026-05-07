import type { CartStateData } from "./Playground.tsx";
import type { CartUpdateAction } from "@commercetools/platform-sdk";

export const handleCartActions = (
  localCartData: CartStateData,
): CartUpdateAction[] => {
  const actions: CartUpdateAction[] = [];

  if (localCartData.taxCalculationMode !== undefined) {
    actions.push({
      action: "changeTaxCalculationMode",
      taxCalculationMode: localCartData.taxCalculationMode,
    });
  }
  if (localCartData.priceRoundingMode !== undefined) {
    actions.push({
      action: "changePriceRoundingMode",
      priceRoundingMode: localCartData.priceRoundingMode,
    });
  }
  if (localCartData.taxRoundingMode !== undefined) {
    actions.push({
      action: "changeTaxRoundingMode",
      taxRoundingMode: localCartData.taxRoundingMode,
    });
  }
  if (localCartData.taxMode !== undefined) {
    actions.push({
      action: "changeTaxMode",
      taxMode: localCartData.taxMode,
    });
  }
  if (localCartData.shippingMethod !== undefined) {
    actions.push({
      action: "setShippingMethod",
      shippingMethod: localCartData.shippingMethod,
    });
  }
  if (localCartData.customerId !== undefined) {
    actions.push({
      action: "setCustomerId",
      customerId: localCartData.customerId,
    });
  }
  if (localCartData.customerEmail !== undefined) {
    actions.push({
      action: "setCustomerEmail",
      email: localCartData.customerEmail,
    });
  }
  if (localCartData.country !== undefined) {
    actions.push({
      action: "setCountry",
      country: localCartData.country,
    });
  }
  if ("billingAddress" in localCartData) {
    actions.push({
      action: "setBillingAddress",
      address: localCartData.billingAddress,
    });
  }
  if ("shippingAddress" in localCartData) {
    actions.push({
      action: "setShippingAddress",
      address: localCartData.shippingAddress,
    });
  }
  if (localCartData.discountCodes !== undefined) {
    for (const code of localCartData.discountCodes) {
      actions.push({
        action: "addDiscountCode",
        code,
      });
    }
  }
  return actions;
};
