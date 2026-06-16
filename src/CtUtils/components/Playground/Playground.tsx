import { useEffect, useMemo, useState } from "react";

function isStandardMode(m: BraintreeCheckoutMode): m is "fullCheckout" | "paymentOnly" {
  return m === "fullCheckout" || m === "paymentOnly";
}
import type { ShippingMethod } from "@commercetools/platform-sdk";
import { getShippingMethods } from "../../services/shipping";
import { ProductsGroup } from "./ProductsGroup";
import { CartLevelSettings } from "./CartSettings/CartLevelSettings";
import { CartSummary } from "./CartSummary";
import type { BraintreeCheckoutMode } from "../../../types.ts";
import { loadStandardCheckout } from "../../../CheckoutLoader/loadStandardCheckout.ts";
import { CartProvider, useCart } from "../../context/CartContext.tsx";
import { VaultCheckout } from "../../../CheckoutLoader/VaultCheckout.tsx";

interface CartWrapperProps {
  mode: BraintreeCheckoutMode;
}

export const Playground = ({ mode }: CartWrapperProps) => (
  <CartProvider mode={mode}>
    <PlaygroundContent mode={mode} />
  </CartProvider>
);

const PlaygroundContent = ({ mode }: CartWrapperProps) => {
  const {
    cart: serverCart,
    setCart: setServerCart,
    localCartData,
    updateLocalCartData,
    updateCart,
    cartError,
  } = useCart();
  const [availableShippingMethods, setAvailableShippingMethods] =
    useState<ShippingMethod[]>();
  const localStateChanged = useMemo(
    () => Object.keys(localCartData).length > 0,
    [localCartData],
  );

  useEffect(() => {
    const country = serverCart?.billingAddress?.country;
    if (!serverCart?.id || !country) {
      setAvailableShippingMethods(undefined);
      return;
    }
    getShippingMethods(serverCart.id).then(({ body }) => {
      setAvailableShippingMethods(body as unknown as ShippingMethod[]); //there is a mismatch in the SDK types for this endpoint, but the response is correct
    });
  }, [serverCart?.billingAddress?.country]);

  useEffect(() => {
    setServerCart(undefined);
  }, [mode]);

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col gap-8 max-w-fit mx-auto self-center">
        {isStandardMode(mode) && <ProductsGroup />}
        {mode !== "pureVault" && (
          <CartLevelSettings
            cartId={serverCart?.id}
            onCartUpdate={updateLocalCartData}
            onSubmit={isStandardMode(mode) ? updateCart : undefined}
            availableShippingMethods={availableShippingMethods}
            allowSubmit={localStateChanged}
          />
        )}
        {mode === "express" && <ProductsGroup isExpress />}
        {serverCart && (mode === "fullCheckout" || mode === "paymentOnly") && (
          <CartSummary
            cart={serverCart}
            cartError={cartError}
            onLoadCheckout={
              isStandardMode(mode)
                ? () => loadStandardCheckout(serverCart.id, mode)
                : undefined
            }
          />
        )}
      </div>
      {mode === "pureVault" && <VaultCheckout />}
    </div>
  );
};
